import User from "../../models/User/user.js";
import Wallet from "../../models/Wallet/Wallet.js";
import Transaction from "../../models/Transaction/Transaction.js";
import createNotification from "../../helpers/createNotification.js";

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

// @desc Freeze or Unfreeze a user account
// @route PATCH /api/v1/admins/users/:userId/toggle-freeze
export const toggleFreezeUserCtrl = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin" || user.isAdmin) {
      return res.status(400).json({ message: "Admin accounts cannot be frozen" });
    }

    user.isFrozen = !user.isFrozen;
    await user.save();

    const statusMessage = user.isFrozen ? "User account frozen" : "User account unfrozen";

    await createNotification(
      user._id,
      user.isFrozen ? "Account Frozen 🔒" : "Account Unfrozen 🔓",
      user.isFrozen
        ? "Your account has been temporarily frozen by compliance. Outgoing transactions and services are suspended."
        : "Your account restriction has been lifted. You can now perform transactions normally."
    );

    res.json({
      status: "success",
      message: `${statusMessage} successfully`,
      isFrozen: user.isFrozen,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};