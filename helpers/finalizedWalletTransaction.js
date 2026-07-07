import mongoose from "mongoose";
import { emitWalletUpdate } from "../socket/socketEmitter.js";
import createNotification from "./createNotification.js";
import { createLedgerEntry } from "./ledgerHelper.js";
import { recordRevenue } from "./revenueHelpers.js";

export const finalizeWalletTransaction = async ({
    wallet,
    balanceBefore,
    balanceAfter,
    reference,
    entryType,
    amount,
    narration,
    notificationTitle,
    notificationMessage,
    revenue,
}) => {

    emitWalletUpdate(wallet.user, {
        balance: balanceAfter,
        accountNumber: wallet.accountNumber,
    });

    await createNotification(
        wallet.user,
        notificationTitle,
        notificationMessage
    );

    if (revenue) {
        await recordRevenue(revenue);
    }

    await createLedgerEntry({
        user: wallet.user,
        reference,
        entryType,
        amount,
        balanceBefore,
        balanceAfter,
        narration,
    });
};

// export const finalizeWalletTransaction = async ({
//     // session,
//     wallet,
//     balanceBefore,
//     balanceAfter,
//     reference,
//     entryType,
//     amount,
//     narration,
//     notificationTitle,
//     notificationMessage,
//     revenue,
// }) => {
//     const session = await mongoose.startSession();

//     try {
//         emitWalletUpdate(wallet.user, {
//             balance: balanceAfter,
//             accountNumber: wallet.accountNumber,
//         });

//         await createNotification(
//             wallet.user,
//             notificationTitle,
//             notificationMessage
//         );

//         if (revenue) {
//             await recordRevenue(revenue);
//         }
//         await session.commitTransaction();


//         await createLedgerEntry({
//             user: wallet.user,
//             reference,
//             entryType,
//             amount,
//             balanceBefore,
//             balanceAfter,
//             narration,
//         });
//     }
//     catch (error) {
//         throw error;
//     }
// };