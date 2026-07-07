import mongoose from "mongoose";

import Transaction from "../../models/Transaction/Transaction.js";
import Wallet from "../../models/Wallet/Wallet.js";

import { createLedgerEntry } from "../../helpers/ledgerHelper.js";
import createNotification from "../../helpers/createNotification.js";

const generateReversalReference = () => {
    return `REV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const reverseTransferService = async ({
    reference,
    adminId,
}) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();
        // console.log("Reference:", reference);

        // Find both transactions
        const transactions = await Transaction.find({ reference }).session(session);

        if (transactions.length !== 2) {
            throw new Error("Transfer not found");
        }

        // Prevent double reversal
        if (
            transactions.some(
                transaction => transaction.reversed
            )
        ) {
            throw new Error("Transfer already reversed.");
        }

        // Generate new reversal reference
        const reversalReference = generateReversalReference();

        // ===========================
        // NEXT STEP
        // ===========================

        // Find sender transaction
        const senderTransaction = transactions.find(
            transaction => transaction.type === "debit"
        );

        // Find receiver transaction
        const receiverTransaction = transactions.find(
            transaction => transaction.type === "credit"
        );
        if (!senderTransaction || !receiverTransaction) {
            throw new Error("Invalid transfer transaction.");
        }
        // Find sender wallet
        const senderWallet = await Wallet.findOne({
            user: senderTransaction.user,
        }).session(session);

        // Find receiver wallet
        const receiverWallet = await Wallet.findOne({
            user: receiverTransaction.user,
        }).session(session);

        if (!senderWallet || !receiverWallet) {
            throw new Error("Wallet not found.");
        }
        if (receiverWallet.balance < senderTransaction.amount) {
            throw new Error(
                "Receiver does not have enough balance for reversal."
            );
        }
        // Debit receiver
        receiverWallet.balance -= senderTransaction.amount;
        // Credit sender
        senderWallet.balance += senderTransaction.amount;
        //save
        await senderWallet.save({
            session,
        });

        await receiverWallet.save({
            session,
        });

        await Transaction.insertMany(
            [
                {
                    user: senderWallet.user,
                    type: "credit",
                    category: "wallet_fund",
                    amount: senderTransaction.amount,
                    reference: reversalReference,
                    status: "success",
                    metadata: {
                        originalReference: reference,
                    },
                },
                {
                    user: receiverWallet.user,
                    type: "debit",
                    category: "wallet_fund",
                    amount: senderTransaction.amount,
                    reference: reversalReference,
                    status: "success",
                    metadata: {
                        originalReference: reference,
                    },
                },
            ],
            { session }
        );

        // mark

        // Create ledger entries
        // sender
        const senderBefore = senderWallet.balance - senderTransaction.amount;
        const senderAfter = senderWallet.balance;
        // receiver

        const receiverBefore = receiverWallet.balance + senderTransaction.amount;
        const receiverAfter = receiverWallet.balance;

        // Update balances
        senderWallet.balance = senderAfter;
        receiverWallet.balance = receiverAfter;

        await senderWallet.save({ session });
        await receiverWallet.save({ session });
        // const amount = senderTransaction.amount;

        // receiverWallet.balance -= amount;

        // senderWallet.balance += amount;

        await createLedgerEntry({
            user: senderWallet.user,
            reference: reversalReference,
            entryType: "credit",
            amount: senderTransaction.amount,
            balanceBefore: senderBefore,
            balanceAfter: senderAfter,
            narration: "Transfer reversal refund",
        });

        await createLedgerEntry({
            user: receiverWallet.user,
            reference: reversalReference,
            entryType: "debit",
            amount: senderTransaction.amount,
            balanceBefore: receiverBefore,
            balanceAfter: receiverAfter,
            narration: "Transfer reversal deduction",
        });

        // Create notifications
        await createNotification(
            senderWallet.user,
            "Transfer Reversed",
            `₦${senderTransaction.amount.toLocaleString()} has been refunded to your wallet.`
        );

        await createNotification(
            receiverWallet.user,
            "Transfer Reversed",
            `₦${senderTransaction.amount.toLocaleString()} has been deducted from your wallet.`
        );

        // Mark transactions as reversed
        await Transaction.updateMany(
            {
                reference,
            },
            {
                $set: {
                    reversed: true,
                    reversedAt: new Date(),
                    reversedBy: adminId,
                    reversalReference,
                },
            },
            {
                session,
            }
        );

        // Commit transaction
        await session.commitTransaction();

        return {
            success: true,
            message: "Transfer reversed successfully.",
            reversalReference,
            // transactions,
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