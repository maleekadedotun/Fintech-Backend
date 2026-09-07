import mongoose from "mongoose";

import User from "../models/User/user.js";

import verifyTransactionPin from "./verifyTransactionPin.js";
import createPendingTransaction from "./createPendingTransaction.js";
import validateProviderResponse from "./validateProviderResponse.js";
import { finalizeWalletTransaction } from "./finalizedWalletTransaction.js";
import successTransaction from "./successTransaction.js";
import { generateReceipt } from "./generateReceipt.js";
// import crypto from "crypto";
// import finalizeWalletTransaction from "./finalizeWalletTransaction.js";

// const generateRef = () => crypto.randomBytes(10).toString("hex");


// const executeBillPayment = async ({
//     userId,
//     pin,
//     amount,
//     category,
//     metadata,
//     providerAction,
//     notificationTitle,
//     notificationMessage,
//     narration,
//     revenue,
// }) => {

//     await verifyTransactionPin(userId, pin);

//     const session = await mongoose.startSession();

//     try {

//         session.startTransaction();

//         const user = await User.findById(userId).session(session);
//         // console.log(user, "execute");


//         if (!user) {
//             throw new Error("User not found");
//         }

//         if (user.isFrozen) {
//             throw new Error("Account is frozen");
//         }

//         const {
//             sender,
//             transaction,
//             reference,
//         } = await createPendingTransaction({

//             userId,

//             amount,

//             category,

//             metadata,

//             session,

//         });

//         // return {
//         //     transaction,
//         //     receipt,
//         // };

//         const response = await providerAction({ reference, user, });

//         await validateProviderResponse({

//             response,

//             transaction,

//             sender,

//             session,

//             defaultMessage: `${category} purchase failed`

//         });

//         await successTransaction({
//             transaction,
//             response,
//             session,
//         });
//         // transaction.status = "success";

//         // transaction.metadata.providerReference =
//         //     response.data.reference;

//         // transaction.metadata.providerStatus =
//         //     response.data.current_status;

//         // await transaction.save({ session });

//         // await session.commitTransaction();

//         // await finalizeWalletTransaction({

//         //     wallet: sender.wallet,

//         //     balanceBefore: sender.balanceBefore,

//         //     balanceAfter: sender.balanceAfter,

//         //     reference,

//         //     entryType: "debit",

//         //     amount,

//         //     narration,

//         //     notificationTitle,

//         //     notificationMessage,

//         //     revenue,

//         // });

//         // const receipt = generateReceipt({
//         //     transaction,
//         //     provider: response,
//         //     walletBalance: sender.balanceAfter,
//         // });

//         await session.commitTransaction();

//         await finalizeWalletTransaction({

//             wallet: sender.wallet,

//             balanceBefore: sender.balanceBefore,

//             balanceAfter: sender.balanceAfter,

//             reference,

//             entryType: "debit",

//             amount,

//             narration,

//             notificationTitle,

//             notificationMessage,

//             revenue,

//         });

//         const receipt = generateReceipt({
//             transaction,
//             provider: response,
//             walletBalance: sender.balanceAfter,
//         });

//         console.log("======== PROVIDER RESPONSE ========");
//         console.dir(response, { depth: null });
//         console.log("===================================");

//         return {
//             transaction,
//             receipt,
//         };
//         generateReceipt({
//             transaction,
//             provider,
//             walletBalance,
//         })

//         // const response = await providerAction(reference);

//         console.log("======== CABLE RESPONSE ========");
//         console.dir(response, { depth: null });
//         console.log("===============================");

//         return {
//             // message: `${category} purchase successful`,
//             transaction,
//             receipt,
//         };

//     }

//     catch (error) {

//         if (session.inTransaction()) {

//             await session.abortTransaction();

//         }

//         throw error;

//     }

//     finally {

//         await session.endSession();

//     }

// };

// import mongoose from "mongoose";

const executeBillPayment = async ({
    userId,
    pin,
    amount,
    category,
    metadata,
    providerAction,
    notificationTitle,
    notificationMessage,
    narration,
    revenue,
}) => {

    // 1. Verify transaction PIN
    await verifyTransactionPin(userId, pin);

    // 2. Validate amount
    amount = Number(amount);

    if (!amount || amount <= 0) {
        throw new Error("Invalid transaction amount");
    }

    const session = await mongoose.startSession();

    try {
        // Start MongoDB transaction
        session.startTransaction();

        // 3. Get user
        const user = await User.findById(userId).session(session);

        if (!user) {
            throw new Error("User not found");
        }

        // 4. Check if account is frozen
        if (user.isFrozen) {
            throw new Error("Account is frozen");
        }

        // 5. Create pending transaction and reserve/check wallet
        const {
            sender,
            transaction,
            reference,
        } = await createPendingTransaction({
            userId,
            amount,
            category,
            metadata,
            session,
        });

        /*
        ==========================================
        6. CALL THE EXTERNAL PROVIDER
        ==========================================

        providerAction receives:
        - reference
        - user

        Example:
        provider.purchaseCable(...)
        */
        const response = await providerAction({
            reference,
            user,
        });

        console.log("======== PROVIDER RESPONSE ========");

        console.dir(response, {
            depth: null,
        });

        console.log("===================================");

        /*
        ==========================================
        7. VALIDATE PROVIDER RESPONSE
        ==========================================
        */

        await validateProviderResponse({
            response,
            transaction,
            sender,
            session,
            defaultMessage: `${category} purchase failed`,
        });

        /*
        ==========================================
        8. MARK TRANSACTION AS SUCCESSFUL
        ==========================================
        */

        await successTransaction({
            transaction,
            response,
            session,
        });

        /*
        ==========================================
        9. COMMIT DATABASE TRANSACTION
        ==========================================

        At this point:
        - Transaction is successful
        - Provider has confirmed payment
        */

        await session.commitTransaction();

        /*
        ==========================================
        10. FINALIZE WALLET TRANSACTION
        ==========================================
        */

        await finalizeWalletTransaction({
            wallet: sender.wallet,

            balanceBefore: sender.balanceBefore,

            balanceAfter: sender.balanceAfter,

            reference,

            entryType: "debit",

            amount,

            narration,

            notificationTitle,

            notificationMessage,

            revenue,
        });

        /*
        ==========================================
        11. GENERATE RECEIPT
        ==========================================
        */

        const receipt = generateReceipt({
            transaction,
            wallet: sender.wallet,
            walletBalance: sender.balanceAfter,
        });

        /*
        ==========================================
        12. RETURN SUCCESSFUL TRANSACTION
        ==========================================
        */

        return {
            transaction,
            receipt,
        };

    } catch (error) {

        console.log("======== BILL PAYMENT ERROR ========");

        console.dir(
            error.provider ||
            error.response?.data ||
            error.message,
            {
                depth: null,
            }
        );

        console.log("====================================");

        /*
        Rollback MongoDB transaction
        */

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw error;

    } finally {

        // Always close session
        await session.endSession();

    }
};

export default executeBillPayment;