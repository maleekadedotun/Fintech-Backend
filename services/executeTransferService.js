// services/transferService.js

import mongoose from "mongoose";
// import User from "../models/User/user.js";
// import Wallet from "../models/Wallet/Wallet.js";
// import Transaction from "../models/Transaction/Transaction.js";
// import { verifyTransactionPin } from "../helpers/verifyTransactionPin.js";
// import { generateRef } from "../utils/generateRef.js";
import { isNewDay } from "../utils/isNewDay.js";
// import { createNotification } from "../helpers/createNotification.js";
// import { recordRevenue } from "../helpers/recordRevenue.js";
// import { createLedgerEntry } from "../helpers/createLedgerEntry.js";
import Transaction from "../models/Transaction/Transaction.js";
import User from "../models/User/user.js";
import Wallet from "../models/Wallet/Wallet.js";
import verifyTransactionPin from "../helpers/verifyTransactionPin.js";
import crypto from "crypto"
import createNotification from "../helpers/createNotification.js";
import { recordRevenue } from "../helpers/revenueHelpers.js";
import { createLedgerEntry } from "../helpers/ledgerHelper.js";
import { emitWalletUpdate } from "../socket/socketEmitter.js";
import { debitWallet, creditWallet } from "./wallet/walletService.js";
import { finalizeWalletTransaction } from "../helpers/finalizedWalletTransaction.js";


const generateRef = () => crypto.randomBytes(10).toString("hex");

export const executeTransfer = async ({ senderUserId, receiverAccountNumber, amount, transactionPin, }) => {

    amount = Number(amount);

    if (!receiverAccountNumber) {
        throw new Error("Account number is required");
    }

    if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }

    // verify transaction pin
    await verifyTransactionPin(senderUserId, transactionPin);

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // Get user
        const user = await User.findById(senderUserId).session(session);

        if (!user) {
            throw new Error("User not found.");
        }
        if (user.isFrozen) {
            throw new Error("Account is frozen.");
        }

        // const session = await mongoose.startSession();

        let dailyLimit = 50000;

        // if(user.isFrozen) {
        //     throw new Error("Your account is frozen.");
        // }

        if (user.tier === 2) {
            dailyLimit = 500000;
        }

        if (user.tier === 3) {
            dailyLimit = 5000000;
        }

        // Sender wallet
        const senderWallet = await Wallet.findOne({
            user: senderUserId,
        }).session(session);

        if (!senderWallet) {
            throw new Error("Sender wallet not found");
        }


        // Reset daily spent if it's a new day
        if (isNewDay(senderWallet.lastTransactionDate)) {
            senderWallet.dailySpent = 0;
            await senderWallet.save({ session });
        }

        if (senderWallet.dailySpent + amount > dailyLimit) {
            throw new Error("Daily transfer limit exceeded");
        }
        // if (senderWallet.balance < amount) {
        //     throw new Error("Insufficient balance");
        // }

        // Receiver wallet
        const receiverWallet = await Wallet.findOne({
            accountNumber: receiverAccountNumber,
        })
            .session(session)
            .populate("user", "name isFrozen");

        if (!receiverWallet) {
            throw new Error("Invalid account number");
        }

        if (receiverWallet.user.isFrozen) {
            throw new Error("Receiver account is frozen.");
        }

        // Prevent self transfer
        if (
            senderWallet.accountNumber === receiverAccountNumber
        ) {
            throw new Error("You cannot transfer to yourself");
        }

        // Check balance
        // if (senderWallet.balance < amount) {
        //     throw new Error("Insufficient balance");
        // }

        // socket.io
        const reference = generateRef();

        // Create pending transactions
        await Transaction.insertMany(
            [
                {
                    user: senderWallet.user,
                    type: "debit",
                    category: "transfer",
                    amount,
                    reference,
                    status: "pending",
                    metadata: {
                        receiverAccountNumber,
                    },
                },
                {
                    user: receiverWallet.user._id,
                    type: "credit",
                    category: "transfer",
                    amount,
                    reference,
                    status: "pending",
                    metadata: {
                        senderAccountNumber:
                            senderWallet.accountNumber,
                    },
                },
            ],
            { session }
        );
        // Debit sender
        // await Wallet.updateOne(
        //     { user: senderWallet.user },
        //     {
        //         $inc: {
        //             balance: -amount,
        //             dailySpent: amount,
        //         },
        //         $set: {
        //             lastTransactionDate: new Date(),
        //         },
        //     },
        //     { session }
        // );
        const sender = await debitWallet({
            userId: senderUserId,
            amount,
            session,
        });

        // Credit receiver
        // await Wallet.updateOne(
        //     {
        //         accountNumber: receiverAccountNumber,
        //     },
        //     {
        //         $inc: {
        //             balance: amount,
        //         },
        //     },
        //     { session }
        // );

        const receiver = await creditWallet({
            accountNumber: receiverAccountNumber,
            amount,
            session,
        });

        // Mark transactions successful
        await Transaction.updateMany(
            {
                reference,
            },
            {
                $set: {
                    status: "success",
                },
            },
            { session }
        );



        // await session.commitTransaction();

        // Ledger
        // const senderBefore = senderWallet.balance;
        // const senderAfter = senderBefore - amount;

        // const receiverBefore = receiverWallet.balance;
        // const receiverAfter = receiverBefore + amount;

        // Commit database transaction
        await session.commitTransaction();

        const fee = amount * 0.02;


        await finalizeWalletTransaction({
            wallet: sender.wallet,
            balanceBefore: sender.balanceBefore,
            balanceAfter: sender.balanceAfter,
            reference,
            entryType: "debit",
            amount,
            narration: `Transfer to ${receiver.wallet.accountNumber}`,
            notificationTitle: "Transfer Sent",
            notificationMessage: `₦${amount} sent successfully`,
            revenue: {
                type: "transfer",
                amount: fee,
                cost: 0,
                reference,
                user: sender.wallet.user,
            },
        });

        await finalizeWalletTransaction({
            wallet: receiver.wallet,
            balanceBefore: receiver.balanceBefore,
            balanceAfter: receiver.balanceAfter,
            reference,
            entryType: "credit",
            amount,
            narration: `Transfer from ${sender.wallet.accountNumber}`,
            notificationTitle: "Money Received",
            notificationMessage: `₦${amount} received successfully`,
        });

        // Update in-memory wallet objects
        // senderWallet
        emitWalletUpdate(sender.wallet.user, {
            balance: sender.balanceAfter,
            accountNumber: sender.wallet.accountNumber,
        });

        // senderWallet.balance = senderAfter;

        // receiverWallet
        emitWalletUpdate(receiver.wallet.user, {
            balance: receiver.balanceAfter,
            accountNumber: receiver.wallet.accountNumber,
        });
        // receiverWallet.balance = receiverAfter;
        // Emit realtime updates
        // emitWalletUpdate(
        //     senderWallet.user,
        //     {
        //         balance: senderAfter,
        //     }
        // );

        // emitWalletUpdate(senderWallet.user, {
        //     balance: sender.balanceAfter,
        //     accountNumber: senderWallet.accountNumber,
        // });

        // emitWalletUpdate(
        //     receiverWallet.user._id,
        //     {
        //         balance: receiverAfter,
        //     }
        // );

        // Notifications
        await createNotification(
            sender.wallet.user,
            "Transfer Sent",
            `₦${amount} sent successfully`
        );

        await createNotification(
            receiver.wallet.user._id,
            "Money Received",
            `₦${amount} received successfully`
        );

        // Revenue
        const transferAmount = amount * 20;

        await recordRevenue({
            type: "transfer",
            amount: transferAmount,
            cost: transferAmount,
            reference,
            user: sender.wallet.user,
        });

        await createLedgerEntry({
            user: sender.wallet.user,
            reference,
            entryType: "debit",
            amount,
            // balanceBefore: senderBefore,
            // balanceAfter: senderAfter,

            balanceBefore: sender.balanceBefore,
            balanceAfter: sender.balanceAfter,
            narration: `Transfer to ${receiver.wallet.accountNumber}`,
        });

        await createLedgerEntry({
            user: receiver.wallet.user._id,
            reference,
            entryType: "credit",
            amount,
            // balanceBefore: receiverBefore,
            // balanceAfter: receiverAfter,

            balanceBefore: receiver.balanceBefore,
            balanceAfter: receiver.balanceAfter,
            narration: `Transfer from ${sender.wallet.accountNumber}`,
        });

        return {
            reference,
            receiver: receiver.wallet.user.name,
            accountNumber:
                receiver.wallet.accountNumber,
        };
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw error;
    } finally {
        await session.endSession();
    }
};