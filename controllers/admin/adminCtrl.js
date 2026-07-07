import User from "../../models/User/user.js";
import Wallet from "../../models/Wallet/Wallet.js";
import Transaction from "../../models/Transaction/Transaction.js";

export const getAdminStatsCtrl = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalWallets = await Wallet.countDocuments();

        const transactions = await Transaction.find();

        const totalTransactions = transactions.length;

        const totalCredit = transactions
            .filter(t => t.type === "credit")
            .reduce((acc, t) => acc + t.amount, 0);

        const totalDebit = transactions
            .filter(t => t.type === "debit")
            .reduce((acc, t) => acc + t.amount, 0);

        const kycPending = await User.countDocuments({
            kycStatus: "pending",
        });

        const kycVerified = await User.countDocuments({
            kycStatus: "verified",
        });

        res.json({
            totalUsers,
            totalWallets,
            totalTransactions,
            totalCredit,
            totalDebit,
            kycPending,
            kycVerified,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getTopUsersCtrl = async (req, res) => {
  try {
    const topUsers = await Transaction.aggregate([
      {
        $group: {
          _id: "$user",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.json({ 
        status: "success",
        data: topUsers });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};