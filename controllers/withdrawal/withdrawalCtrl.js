import Wallet from "../../models/Wallet/Wallet.js";
import mongoose from "mongoose";
import crypto from "crypto";
import Withdrawal from "../../models/Withdrawal/Withdrawal.js";
import { createLedgerEntry } from "../../helpers/ledgerHelper.js";
import createNotification from "../../helpers/createNotification.js";
import verifyTransactionPin from "../../helpers/verifyTransactionPin.js";

const generateRef = () => crypto.randomBytes(10).toString("hex");


export const withdrawCtrl = async (req, res) => {
    const {
        amount,
        bankName,
        accountNumber,
        accountName,
        pin,
    } = req.body;

    const session = await mongoose.startSession();

    session.startTransaction();

    await verifyTransactionPin(
        req.userAuth,
        pin
    );

    try {
        const wallet = await Wallet.findOne({
            user: req.userAuth,
        }).session(session);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        if (wallet.balance < amount) {
            throw new Error(
                "Insufficient balance"
            );
        }

        const reference = generateRef();

        const before = wallet.balance;

        wallet.balance -= amount;

        const after = wallet.balance;

        await wallet.save({ session });

        const withdrawal = await Withdrawal.create(
            [
                {
                    user: req.userAuth,
                    amount,
                    bankName,
                    accountNumber,
                    accountName,
                    reference,
                    status: "pending",
                },
            ],
            { session }
        );

        await createLedgerEntry({
            user: wallet.user,
            reference,
            entryType: "debit",
            amount,
            balanceBefore: before,
            balanceAfter: after,
            narration: "Bank withdrawal",
        });

        await createNotification(
            req.userAuth,
            "Withdrawal Requested",
            `₦${amount} withdrawal request submitted`
        );

        await session.commitTransaction();

        session.endSession();

        res.json({
            message: "Withdrawal request created",
            data: withdrawal,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            message: error.message,
        });
    }
};

export const approveWithdrawalCtrl = async (req, res) => {
    try {
        const { withdrawalId } = req.params;

        const withdrawal = await Withdrawal.findById(withdrawalId);

        if (!withdrawal) {
            return res.status(404).json({
                message: "Withdrawal not found",
            });
        }

        if (withdrawal.status !== "pending") {
            return res.status(400).json({
                message: "Withdrawal already processed",
            });
        }

        withdrawal.status = "success";
        await withdrawal.save();

        await createNotification(
            withdrawal.user,
            "Withdrawal Successful",
            `₦${withdrawal.amount} sent to your bank account`
        );

        res.json({
            message: "Withdrawal approved successfully",
            withdrawal,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};