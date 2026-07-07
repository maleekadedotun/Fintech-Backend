// import emitWalletChange from "../../helpers/emitWalletChange.js";
import Wallet from "../../models/Wallet/Wallet.js";
// import Wallet from "../models/Wallet/Wallet.js";

export const debitWallet = async ({ userId, amount, session }) => {

    const wallet = await Wallet.findOne({
        user: userId,
    }).session(session);

    if (!wallet) {
        throw new Error("Wallet not found");
    }

    if (wallet.balance < amount) {
        throw new Error("Insufficient balance");
    }

    // const balanceBefore = wallet.balance;
    // // const balanceAfter = balanceBefore - amount;
    // const balanceAfter = await Wallet.findOneAndUpdate(
    //     {
    //         user: userId,
    //         balance: { $gte: amount }
    //     },
    //     {
    //         $inc: {
    //             balance: -amount,
    //             dailySpent: amount
    //         },
    //         $set: {
    //             lastTransactionDate: new Date()
    //         }
    //     },
    //     {
    //         new: true,
    //         session
    //     }
    // );

    // wallet.balance = balanceAfter;

    // // wallet.balance -= amount;
    // wallet.dailySpent += amount;
    // wallet.lastTransactionDate = new Date();

    // // await wallet.save({ session });

    // await wallet.save({ session });
    // return {
    //     wallet,
    //     balanceBefore,
    //     balanceAfter,
    // };


    const updatedWallet = await Wallet.findOneAndUpdate(
        {
            user: userId,
            balance: { $gte: amount },
        },
        {
            $inc: {
                balance: -amount,
                dailySpent: amount,
            },
            $set: {
                lastTransactionDate: new Date(),
            },
        },
        {
            new: true,
            session,
        }
    );

    if (!updatedWallet) {
        throw new Error("Insufficient balance");
    }

    return {
        wallet: updatedWallet,
        balanceBefore: updatedWallet.balance + amount,
        balanceAfter: updatedWallet.balance,
    };
};

export const creditWallet = async ({ accountNumber, amount, session, }) => {

    const wallet = await Wallet.findOne({
        accountNumber,
    }).session(session);

    if (!wallet) {
        throw new Error("Wallet not found");
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;

    wallet.balance = balanceAfter;

    await wallet.save({ session });

    return {
        wallet,
        balanceBefore,
        balanceAfter,
    };
};