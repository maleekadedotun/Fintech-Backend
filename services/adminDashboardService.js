import User from "../models/User/user.js";
import Wallet from "../models/Wallet/Wallet.js";
import Withdrawal from "../models/Withdrawal/Withdrawal.js";
import Revenue from "../models/Revenue/Revenue.js";
import Transaction from "../models/Transaction/Transaction.js";
// import Transaction from "../models/Transaction/Transaction.js";

export const getDashboardStats = async () => {
    // Beginning of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Wallets
    const totalWallets = await Wallet.countDocuments();

    // Total Wallet Balance
    const walletBalance = await Wallet.aggregate([
        {
            $group: {
                _id: null,
                totalBalance: {
                    $sum: "$balance",
                },
            },
        },
    ]);

    // Pending Withdrawals
    const pendingWithdrawals =
        await Withdrawal.countDocuments({
            status: "pending",
        });

    // Total Revenue
    const revenue = await Revenue.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$profit",
                },
            },
        },
    ]);

    // Today's Transfers
    const todayTransfers = await Transaction.aggregate([
        {
            $match: {
                category: "transfer",
                type: "debit",
                status: "success",
                createdAt: {
                    $gte: startOfToday,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalTransfer: {
                    $sum: "$amount",
                },
            },
        },
    ]);

    return {
        totalUsers,
        totalWallets,

        totalWalletBalance:
            walletBalance[0]?.totalBalance || 0,

        pendingWithdrawals,

        totalRevenue:
            revenue[0]?.totalRevenue || 0,

        todayTransfers:
            todayTransfers[0]?.totalTransfer || 0,
    };
};