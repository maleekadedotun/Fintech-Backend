// import verifyTransactionPin from "../../helpers/verifyTransactionPin";
// import Transaction from "../../models/Transaction/Transaction";
// import { debitWallet } from "../wallet/walletService";
// import crypto from "crypto";


// // Utility: generate transaction reference
// const generateRef = () => crypto.randomBytes(10).toString("hex");
// export const buyData = async ({ phoneNumber,
//     network,
//     planId,
//     amount,
//     pin }) => {
//     if (!phoneNumber) {
//         throw new Error("Phone number is required");
//     }


//     if (!network) {
//         throw new Error("Network is required");
//     }

//     if (!planId) {
//         throw new Error("Data plan is required");

//     }

//     if (!amount || amount <= 0) {
//         throw new Error("Invalid amount");

//     }
//     // verify pin
//     await verifyTransactionPin(userId, pin);

//     const session = await mongoose.startSession();

//     session.startTransaction();

//     const user = await User.findById(userId).session(session);

//     if (!user) {
//         throw new Error("User not found");

//     }

//     if (user.isFrozen) {
//         throw new Error("Account frozen");

//     }
//     const sender = await debitWallet({
//         userId,
//         amount,
//         session,
//     });
//     const reference = generateRef();

//     const pending = await Transaction.create({
//         status: "pending"
//     });

//     return res.status(200).json({
//         message: "Data purchase successful",
//         // transaction: pending,
//     });
// }

import mongoose from "mongoose";
import crypto from "crypto";

import User from "../../models/User/user.js";
import Transaction from "../../models/Transaction/Transaction.js";

import verifyTransactionPin from "../../helpers/verifyTransactionPin.js";
import createNotification from "../../helpers/createNotification.js";

import { recordRevenue } from "../../helpers/revenueHelpers.js";
import { createLedgerEntry } from "../../helpers/ledgerHelper.js";

import { debitWallet } from "../wallet/walletService.js";
import { emitWalletUpdate } from "../../socket/socketEmitter.js";
import { buyDataBundle } from "../../helpers/provider/dataProvider.js";

// import { buyDataBundle } from "../../helpers/providers/dataProvider.js";


const generateRef = () => crypto.randomBytes(10).toString("hex");


export const buyData = async ({
    userId,
    phoneNumber,
    network,
    planId,
    amount,
    pin,
}) => {
    // Validate
    amount = Number(amount);

    if (!phoneNumber) {
        throw new Error("Phone number is required");
    }

    if (!network) {
        throw new Error("Network is required");
    }

    if (!planId) {
        throw new Error("Data plan is required");
    }

    if (!amount || amount <= 0) {
        throw new Error("Invalid amount");
    }

    // Wallet
    // const wallet = await Wallet.findOne({
    //     user: userId,
    // }).session(session);

    // if (!wallet) {
    //     throw new Error("Wallet not found");
    // }

    // if (wallet.balance < amount) {
    //     throw new Error("Insufficient balance");
    // }

    // verify pin
    await verifyTransactionPin(userId, pin);

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const user = await User.findById(userId)
            .session(session);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.isFrozen) {
            throw new Error("Account is frozen");
        }
        const sender = await debitWallet({
            userId,
            amount,
            session,
        });
        const reference = generateRef();


        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore - amount;

        wallet.balance = balanceAfter;

        const [transaction] = await Transaction.create(
            [
                {
                    user: userId,
                    type: "debit",
                    category: "data",
                    amount,
                    reference,
                    status: "pending",
                    metadata: {
                        phoneNumber,
                        network,
                        planId,
                    },
                },
            ],
            { session }
        );



        const providerResponse = await buyDataBundle({
            phoneNumber,
            network,
            planId,
        });


        if (!providerResponse.success) {

            transaction.status = "failed";

            await transaction.save({ session });

            throw new Error("Provider failed");

        }

        // transaction.status = "success";

        // await transaction.save({ session });

        transaction.status = "success";

        transaction.metadata.providerReference = providerResponse.providerReference;

        await transaction.save({ session });

        await session.commitTransaction();

        emitWalletUpdate(sender.wallet.user, {
            balance: sender.balanceAfter,
            accountNumber: sender.wallet.accountNumber,
        });

        // revenue
        await recordRevenue({
            type: "data",
            amount,
            cost: amount * 0.98,
            reference,
            user: userId,
        });
        // await createNotification(...);

        await createNotification(
            userId,
            "Data Purchase",
            `₦${amount} data purchased for ${phoneNumber}`
        );

        // await createLedgerEntry(...);
        await createLedgerEntry({
            user: userId,
            reference,
            entryType: "debit",
            amount,
            // balanceBefore,
            // balanceAfter,
            // narration: `Data purchase`,
            narration: `Data purchase (${network})`,
        });

        // return {
        //     message: "Data purchase successful",
        //     reference,
        //     phoneNumber,
        //     network,
        //     planId,
        //     amount,
        //     transaction,
        // };

        return {
            status: "Data purchase successful",
            transaction,
            providerReference: providerResponse.providerReference,
        }


    } catch (error) {
        // throw new Error(error.message || "Data purchase failed");
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw error;

    } finally {
        await session.endSession();
    }
}