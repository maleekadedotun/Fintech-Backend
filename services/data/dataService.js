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
import { getDataPlans, purchaseData } from "../providers/smePlug/data.js";

// import { buyDataBundle } from "../../helpers/providers/dataProvider.js";


const generateRef = () => crypto.randomBytes(10).toString("hex");


// export const buyData = async ({
//     // userId,
//     // phone,
//     // network,
//     // planId,
//     amount,
//     // pin,
//     userId,
//     phone,
//     networkId,
//     planId,
//     pin,
// }) => {
//     // Validate
//     amount = Number(amount);

//     if (!phone) {
//         throw new Error("Phone number is required");
//     }

//     if (!networkId) {
//         throw new Error("Network is required");
//     }

//     if (!planId) {
//         throw new Error("Data plan is required");
//     }

//     if (!amount || amount <= 0) {
//         throw new Error("Invalid amount");
//     }

//     // Wallet
//     // const wallet = await Wallet.findOne({
//     //     user: userId,
//     // }).session(session);

//     // if (!wallet) {
//     //     throw new Error("Wallet not found");
//     // }

//     // if (wallet.balance < amount) {
//     //     throw new Error("Insufficient balance");
//     // }

//     // verify pin
//     await verifyTransactionPin(userId, pin);

//     const session = await mongoose.startSession();

//     try {
//         session.startTransaction();
//         const user = await User.findById(userId)
//             .session(session);

//         if (!user) {
//             throw new Error("User not found");
//         }

//         if (user.isFrozen) {
//             throw new Error("Account is frozen");
//         }

//         // const plans = await getDataPlans(networkId);

//         // const selectedPlan = plans.find(
//         //     p => p.id == planId
//         // );

//         // const plansResponse = await getDataPlans(networkId);

//         // // convert to array
//         // const plans = Object.values(plansResponse.data);

//         // console.log("plans:");
//         // console.dir(plans, { depth: null });

//         // console.log("plans.data:");
//         // console.dir(plans.data, { depth: null });

//         // console.log("Is Array:", Array.isArray(plans.data));

//         // const selectedPlan = plans.find(
//         //     plan => plan.id == planId
//         // );

//         // if (!selectedPlan) {
//         //     throw new Error("Invalid plan selected");
//         // }

//         // const plansResponse = await getDataPlans(networkId);

//         // Convert object to array
//         // const plans = Object.values(plansResponse.data);

//         // console.log("Received planId:", planId);
//         // console.log("Type of planId:", typeof planId);

//         // console.log("Plans length:", plans.length);

//         // console.log(
//         //     "Available plan IDs:",
//         //     plans.map(plan => plan.id)
//         // );
//         // console.log(JSON.stringify(plans[0], null, 2), "josn");

//         const plansResponse = await getDataPlans(networkId);

//         // console.log("plansResponse:");
//         // console.dir(plansResponse, { depth: null });

//         const plans = Object.values(plansResponse.data);

//         // console.log("First plan:");
//         // console.dir(plans[0], { depth: null });

//         const selectedPlan = plans.find(
//             plan => Number(plan.id) === Number(planId)
//         );
//         console.log(JSON.stringify(plans[0], null, 2), "josn");


//         console.log("Selected plan:", selectedPlan, "Selected plans");

//         if (!selectedPlan) {
//             throw new Error("Invalid plan selected");
//         }
//         const amount = Number(planId.price); // We'll fix this shortly

//         const sender = await debitWallet({
//             userId,
//             amount,
//             session,
//         });
//         const reference = generateRef();


//         const balanceBefore = wallet.balance;
//         const balanceAfter = balanceBefore - amount;

//         wallet.balance = balanceAfter;

//         const [transaction] = await Transaction.create(
//             [
//                 {
//                     user: userId,
//                     type: "debit",
//                     category: "data",
//                     amount,
//                     reference,
//                     status: "pending",
//                     metadata: {
//                         phoneNumber,
//                         networkId,
//                         planId,
//                         phone,
//                     },
//                 },
//             ],
//             { session }
//         );

//         const provider = await purchaseData({
//             networkId,
//             planId,
//             phone,
//             reference,
//         });

//         if (
//             !provider.status ||
//             provider.data.current_status !== "successful"
//         ) {
//             throw new Error(
//                 provider.data.msg || "Data purchase failed"
//             );
//         }

//         const providerResponse = await buyDataBundle({
//             phoneNumber,
//             network,
//             planId,
//         });


//         if (!providerResponse.success) {

//             transaction.status = "failed";

//             await transaction.save({ session });

//             throw new Error("Provider failed");

//         }

//         // transaction.status = "success";

//         // await transaction.save({ session });

//         transaction.status = "success";

//         transaction.metadata.providerReference = providerResponse.providerReference;

//         await transaction.save({ session });

//         await session.commitTransaction();

//         emitWalletUpdate(sender.wallet.user, {
//             balance: sender.balanceAfter,
//             accountNumber: sender.wallet.accountNumber,
//         });

//         // revenue
//         await recordRevenue({
//             type: "data",
//             amount,
//             cost: amount * 0.98,
//             reference,
//             user: userId,
//         });
//         // await createNotification(...);

//         await createNotification(
//             userId,
//             "Data Purchase",
//             `₦${amount} data purchased for ${phoneNumber}`
//         );

//         // await createLedgerEntry(...);
//         await createLedgerEntry({
//             user: userId,
//             reference,
//             entryType: "debit",
//             amount,
//             // balanceBefore,
//             // balanceAfter,
//             // narration: `Data purchase`,
//             narration: `Data purchase (${network})`,
//         });

//         // return {
//         //     message: "Data purchase successful",
//         //     reference,
//         //     phoneNumber,
//         //     network,
//         //     planId,
//         //     amount,
//         //     transaction,
//         // };

//         return {
//             status: "Data purchase successful",
//             transaction,
//             providerReference: providerResponse.providerReference,
//         }


//     } catch (error) {
//         // throw new Error(error.message || "Data purchase failed");
//         if (session.inTransaction()) {
//             await session.abortTransaction();
//         }

//         throw error;

//     } finally {
//         await session.endSession();
//     }
// }

export const buyData = async ({
    userId,
    phone,
    networkId,
    planId,
    pin,
}) => {

    if (!phone) {
        throw new Error("Phone number is required");
    }

    if (!networkId) {
        throw new Error("Network is required");
    }

    if (!planId) {
        throw new Error("Data plan is required");
    }

    await verifyTransactionPin(userId, pin);

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findById(userId).session(session);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.isFrozen) {
            throw new Error("Account is frozen");
        }

        // Fetch available plans
        const plansResponse = await getDataPlans(networkId);


        // const plans = Array.isArray(plansResponse.data)
        //     ? plansResponse.data
        //     : Object.values(plansResponse.data);

        // Object.values => convert object to array
        const plans = Array.isArray(plansResponse.data)
            ? plansResponse.data.flat()
            : Object.values(plansResponse.data).flat();

        console.log("========= PLAN DEBUG =========");
        console.log("Received planId:", planId);
        console.log("Is Array:", Array.isArray(plans));
        console.log("Plans length:", plans.length);
        console.log("First plan:", plans[0]);
        console.log("First plan keys:", Object.keys(plans[0]));
        console.log(
            "Matching plans:",
            plans.filter(p => Number(p.id) === Number(planId))
        );
        console.log("==============================");
        console.log(Array.isArray(plans[0]), "bbvvvb");

        const selectedPlan = plans.find(
            p => Number(p.id) === Number(planId)
        );

        if (!selectedPlan) {
            throw new Error("Invalid data plan selected")
        }

        // Amount to charge;
        const amount =
            Number(selectedPlan.price) ||
            Number(selectedPlan.telco_price);

        if (!amount || amount <= 0) {
            throw new Error("Invalid plan amount");
        }

        // Debit wallet
        const sender = await debitWallet({
            userId,
            amount,
            session,
        });

        const reference = generateRef();

        // Create pending transaction
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
                        phone,
                        networkId,
                        planId,
                    },
                },
            ],
            { session }
        );

        // Purchase from SMEPlug
        const provider = await purchaseData({
            networkId,
            planId,
            phone,
            reference,
        });

        if (
            !provider.status ||
            provider.data.current_status !== "successful"
        ) {
            transaction.status = "failed";

            await transaction.save({ session });

            throw new Error(
                provider.data.msg || "Data purchase failed"
            );
        }

        // Mark successful
        transaction.status = "success";

        transaction.metadata.providerReference =
            provider.data.reference;

        await transaction.save({ session });

        await session.commitTransaction();

        // Emit realtime wallet update
        emitWalletUpdate(sender.wallet.user, {
            balance: sender.balanceAfter,
            accountNumber: sender.wallet.accountNumber,
        });

        // Notification
        await createNotification(
            userId,
            "Data Purchase",
            `₦${amount} data purchased for ${phone}`
        );

        // Revenue
        await recordRevenue({
            type: "data",
            amount,
            cost: amount,
            reference,
            user: userId,
        });

        // Ledger
        await createLedgerEntry({
            user: userId,
            reference,
            entryType: "debit",
            amount,
            balanceBefore: sender.balanceBefore,
            balanceAfter: sender.balanceAfter,
            narration: `Data purchase`,
        });

        return {
            message: "Data purchase successful",
            reference,
            providerReference: provider.data.reference,
            transaction,
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