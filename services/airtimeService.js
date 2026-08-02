// services/airtimeService.js

import mongoose from "mongoose";
import User from "../models/User/user.js";
// import Wallet from "../models/Wallet/Wallet.js";
// import Transaction from "../models/Transaction/Transaction.js";

import verifyTransactionPin from "../helpers/verifyTransactionPin.js";
import createNotification from "../helpers/createNotification.js";
import { recordRevenue } from "../helpers/revenueHelpers.js";
import { createLedgerEntry } from "../helpers/ledgerHelper.js";
import emitWalletChange from "../helpers/emitWalletChange.js";

// import crypto from "crypto";
import providerFactory from "./providers/factory/providerFactory.js";
import createPendingTransaction from "../helpers/createPendingTransaction.js";
import failTransaction from "../helpers/failTransacton.js";
import { finalizeWalletTransaction } from "../helpers/finalizedWalletTransaction.js";
import validateProviderResponse from "../helpers/validateProviderResponse.js";
import executeBillPayment from "../helpers/executeBillPayment.js";

// const generateRef = () => crypto.randomBytes(10).toString("hex");

// export const buyAirtimeService = async ({ userId, phoneNumber, networkId, amount, pin }) => {

//     amount = Number(amount);

//     if (!phoneNumber || !networkId) {
//         throw new Error("Phone number and network are required");
//     }

//     if (isNaN(amount) || amount <= 0) {
//         throw new Error("Invalid amount");
//     }

//     await verifyTransactionPin(userId, pin);

//     const session = await mongoose.startSession();

//     try {
//         session.startTransaction();

//         const user = await User.findById(userId).session(session);

//         if (!user)
//             throw new Error("User not found");

//         if (user.isFrozen) {
//             throw new Error("Account is frozen.");

//         }

//         // const wallet = await Wallet.findOne({
//         //     user: userId,
//         // }).session(session);

//         // if (!wallet) {
//         //     throw new Error("Wallet not found");
//         // }

//         // if (wallet.balance < amount) {
//         //     throw new Error("Insufficient balance");
//         // }

//         // const reference = generateRef();

//         // const balanceBefore = wallet.balance;
//         // const balanceAfter = balanceBefore - amount;

//         // wallet.balance = balanceAfter;

//         // await wallet.save({ session });

//         // const transaction = await Transaction.create(
//         //     [
//         //         {
//         //             user: userId,
//         //             type: "debit",
//         //             category: "airtime",
//         //             amount,
//         //             status: "success",
//         //             reference,
//         //             metadata: {
//         //                 phoneNumber,
//         //                 networkId,
//         //             },
//         //         },
//         //     ],
//         //     { session }
//         // );
//         const {
//             sender,
//             transaction,
//             reference,
//         } = await createPendingTransaction({

//             userId,

//             amount,

//             category: "airtime",

//             metadata: {
//                 phoneNumber,
//                 networkId,
//             },

//             session,
//         });
//         const provider = providerFactory();

//         const response = await provider.buyAirtime({
//             networkId,
//             phoneNumber,
//             amount,
//             reference,
//         });
//         // if (!response.status) {

//         //     await failTransaction({
//         //         transaction,
//         //         sender,
//         //         session,
//         //     });

//         //     throw {
//         //         statusCode: 400,
//         //         message: response.msg || response.data?.msg || "Airtime purchase failed",
//         //         provider: response,
//         //     };
//         // }

//         // const isSuccessful =
//         //     response?.status &&
//         //     response?.data?.current_status === "successful";

//         // if (!isSuccessful) {
//         //     await failTransaction({
//         //         transaction,
//         //         sender,
//         //         session,
//         //     });

//         //     throw {
//         //         statusCode: 400,
//         //         message:
//         //             response?.msg ||
//         //             response?.data?.msg ||
//         //             "Airtime purchase failed",
//         //         provider: response,
//         //     };
//         // }
//         await validateProviderResponse({
//             response,
//             transaction,
//             sender,
//             session,
//             defaultMessage: "Airtime purchase failed",
//         });

//         // success
//         transaction.status = "success";

//         transaction.metadata.providerReference = response.data?.reference;
//         // provider status
//         transaction.metadata.providerStatus = response.data?.current_status;

//         await transaction.save({ session });

//         await session.commitTransaction();

//         // await emitWalletChange(userId);

//         // await createNotification(
//         //     userId,
//         //     "Airtime Purchase",
//         //     `₦${amount} airtime purchased for ${phoneNumber}`
//         // );

//         // await recordRevenue({
//         //     type: "airtime",
//         //     amount,
//         //     cost: amount * 0.98,
//         //     reference,
//         //     user: userId,
//         // });

//         // await createLedgerEntry({
//         //     user: userId,
//         //     reference,
//         //     entryType: "debit",
//         //     amount,
//         //     // balanceBefore,
//         //     // balanceAfter,
//         //     balanceBefore: sender.balanceBefore,
//         //     balanceAfter: sender.balanceAfter,
//         //     narration: `Airtime purchase`,
//         // });
//         await finalizeWalletTransaction({
//             transaction,
//             sender,
//             amount,
//             reference,
//             narration: "Airtime purchase",
//             notificationTitle: "Airtime Purchase",
//             notificationMessage: `₦${amount} airtime purchased for ${phoneNumber}`,
//             revenueType: "airtime",
//         });



//         return transaction;

//     } catch (error) {

//         if (session.inTransaction()) {
//             await session.abortTransaction();
//         }

//         throw error;

//     } finally {
//         await session.endSession();
//     }
// };

export const buyAirtimeService = async ({
    userId,
    phoneNumber,
    networkId,
    amount,
    pin,
}) => {

    // const provider = providerFactory();
    const provider = providerFactory("airtime");

    return await executeBillPayment({

        userId,

        pin,

        amount,

        category: "airtime",

        metadata: {
            phoneNumber,
            networkId,
        },

        providerAction: (reference) =>
            provider.buyAirtime({
                networkId,
                phoneNumber,
                amount,
                reference,
            }),

        notificationTitle: "Airtime Purchase",

        notificationMessage:
            `₦${amount} airtime purchased for ${phoneNumber}`,

        narration: "Airtime purchase",

        revenue: {

            type: "airtime",

            amount, 

            cost: amount * 0.98,

            reference: null, // we'll discuss this below

            user: userId,

        }

    });

};