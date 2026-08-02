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

    await verifyTransactionPin(userId, pin);

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const user = await User.findById(userId).session(session);
        // console.log(user, "execute");


        if (!user) {
            throw new Error("User not found");
        }

        if (user.isFrozen) {
            throw new Error("Account is frozen");
        }

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

        // return {
        //     transaction,
        //     receipt,
        // };

        const response = await providerAction({ reference, user, });

        await validateProviderResponse({

            response,

            transaction,

            sender,

            session,

            defaultMessage: `${category} purchase failed`

        });

        await successTransaction({
            transaction,
            response,
            session,
        });
        // transaction.status = "success";

        // transaction.metadata.providerReference =
        //     response.data.reference;

        // transaction.metadata.providerStatus =
        //     response.data.current_status;

        // await transaction.save({ session });

        await session.commitTransaction();

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

        // const receipt = generateReceipt({
        //     transaction,
        //     provider: response,
        //     walletBalance: sender.balanceAfter,
        // });
        generateReceipt({
            transaction,
            provider,
            walletBalance,
        })

        // const response = await providerAction(reference);

        console.log("======== CABLE RESPONSE ========");
        console.dir(response, { depth: null });
        console.log("===============================");

        return {
            // message: `${category} purchase successful`,
            transaction,
            receipt,
        };

    }

    catch (error) {

        if (session.inTransaction()) {

            await session.abortTransaction();

        }

        throw error;

    }

    finally {

        await session.endSession();

    }

};

export default executeBillPayment;