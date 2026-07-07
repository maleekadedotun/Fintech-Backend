// services/airtimeService.js

import mongoose from "mongoose";
import User from "../models/User/user.js";
import Wallet from "../models/Wallet/Wallet.js";
import Transaction from "../models/Transaction/Transaction.js";

import verifyTransactionPin from "../helpers/verifyTransactionPin.js";
import createNotification from "../helpers/createNotification.js";
import { recordRevenue } from "../helpers/revenueHelpers.js";
import { createLedgerEntry } from "../helpers/ledgerHelper.js";
import emitWalletChange from "../helpers/emitWalletChange.js";

import crypto from "crypto";

const generateRef = () => crypto.randomBytes(10).toString("hex");

export const buyAirtimeService = async ({userId, phoneNumber, network, amount, pin}) => {

    amount = Number(amount);

    if (!phoneNumber || !network) {
        throw new Error("Phone number and network are required");
    }

    if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount");
    }

    await verifyTransactionPin(userId, pin);

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findById(userId).session(session);

        if (!user)
            throw new Error("User not found");

        if (user.isFrozen) {
            throw new Error("Account is frozen.");

        }

        const wallet = await Wallet.findOne({
            user: userId,
        }).session(session);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        if (wallet.balance < amount) {
            throw new Error("Insufficient balance");
        }

        const reference = generateRef();

        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore - amount;

        wallet.balance = balanceAfter;

        await wallet.save({ session });

        const transaction = await Transaction.create(
            [
                {
                    user: userId,
                    type: "debit",
                    category: "airtime",
                    amount,
                    status: "success",
                    reference,
                    metadata: {
                        phoneNumber,
                        network,
                    },
                },
            ],
            { session }
        );

        await session.commitTransaction();

        await emitWalletChange(userId);

        await createNotification(
            userId,
            "Airtime Purchase",
            `₦${amount} airtime purchased for ${phoneNumber}`
        );

        await recordRevenue({
            type: "airtime",
            amount,
            cost: amount * 0.98,
            reference,
            user: userId,
        });

        await createLedgerEntry({
            user: userId,
            reference,
            entryType: "debit",
            amount,
            balanceBefore,
            balanceAfter,
            narration: `Airtime purchase`,
        });

        return transaction[0];

    } catch (error) {

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        throw error;

    } finally {
        await session.endSession();
    }
};