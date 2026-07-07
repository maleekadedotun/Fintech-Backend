import Transaction from "../../models/Transaction/Transaction.js";
import Wallet from "../../models/Wallet/Wallet.js";
import createNotification from "../../helpers/createNotification.js";
import { createLedgerEntry } from "../../helpers/ledgerHelper.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { reverseTransferService } from "../../services/reverse/reverseTransferService.js";



const generateRef = () => crypto.randomBytes(10).toString("hex");

// export const reverseTransactionCtrl = async (

//     req,
//     res
// ) => {
//     const { reference } = req.body;

//     const session =
//         await mongoose.startSession();

//     session.startTransaction();

//     try {
//         const tx = await Transaction.findOne({
//             reference,
//         }).session(session);

//         if (!tx) {
//             throw new Error(
//                 "Transaction not found"
//             );
//         }

//         if (tx.reversed) {
//             throw new Error(
//                 "Transaction already reversed"
//             );
//         }

//         const wallet = await Wallet.findOne({
//             user: tx.user,
//         }).session(session);

//         if (!wallet) {
//             throw new Error("Wallet not found");
//         }

//         const reversalReference =
//             generateRef();

//         const before = wallet.balance;

//         if (tx.type === "debit") {
//             wallet.balance += tx.amount;
//         } else {
//             wallet.balance -= tx.amount;
//         }

//         const after = wallet.balance;

//         await wallet.save({ session });

//         await Transaction.create(
//             [
//                 {
//                     user: tx.user,
//                     type:
//                         tx.type === "debit"
//                             ? "credit"
//                             : "debit",
//                     category: "wallet_fund",
//                     amount: tx.amount,
//                     reference: reversalReference,
//                     status: "success",
//                 },
//             ],
//             { session }
//         );

//         tx.reversed = true;
//         tx.reversalReference =
//             reversalReference;

//         await tx.save({ session });

//         await session.commitTransaction();

//         session.endSession();

//         // const reversalReference = generateRef();

//         await createLedgerEntry({
//             user: wallet.user,
//             reference: reversalReference,
//             entryType:
//                 tx.type === "debit"
//                     ? "credit"
//                     : "debit",
//             amount: tx.amount,
//             balanceBefore: before,
//             balanceAfter: after,
//             narration: "Transaction reversal",
//         });

//         await createNotification(
//             wallet.user,
//             "Transaction Reversed",
//             `₦${tx.amount} has been refunded`
//         );

//         res.json({
//             message:
//                 "Transaction reversed successfully",
//             reversalReference,
//         });
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();

//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };


export const reverseTransferCtrl = async (req, res) => {
    try {
        const result = await reverseTransferService({
            reference: req.params.reference,
            adminId: req.userAuth,
        });

        return res.status(200).json({
            success: true,
            ...result,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};