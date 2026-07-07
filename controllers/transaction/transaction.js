import Transaction from "../../models/Transaction/Transaction.js";
import User from "../../models/User/user.js";
import Wallet from "../../models/Wallet/Wallet.js";
import crypto from "crypto";
import mongoose from "mongoose";
import { isNewDay } from "../../utils/helper.js";
import createNotification from "../../helpers/createNotification.js";
import { recordRevenue } from "../../helpers/revenueHelpers.js";
import { createLedgerEntry } from "../../helpers/ledgerHelper.js";
import verifyTransactionPin from "../../helpers/verifyTransactionPin.js";
import { executeTransfer } from "../../services/executeTransferService.js";


// Utility: generate transaction reference
const generateRef = () => crypto.randomBytes(10).toString("hex");

// @desc Get wallet balance
// @route GET /api/wallet
export const getWalletCtrl = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.userAuth });

  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  res.json({
    balance: wallet.balance,
    currency: wallet.currency,
  });
};

export const creditWalletCtrl = async (req, res) => {
  const { amount, category } = req.body;

  const wallet = await Wallet.findOne({ user: req.userAuth });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const creditAmount = Number(amount);

  const balanceBefore = wallet.balance;

  wallet.balance += creditAmount;

  const balanceAfter = wallet.balance;

  await wallet.save();

  const reference = generateRef();

  const transaction = await Transaction.create({
    user: req.userAuth,
    type: "credit",
    category,
    amount: creditAmount,
    reference,
    status: "success",
  });

  // Ledger entry
  await createLedgerEntry({
    user: wallet.user,
    reference,
    entryType: "credit",
    amount: creditAmount,
    balanceBefore,
    balanceAfter,
    narration: "Wallet funding",
  });

  res.json({
    message: "Wallet credited successfully",
    data: transaction,
  });
};

export const transferFundsCtrl = async (req, res) => {
  try {
    const {
      accountNumber,
      amount,
      transactionPin,
    } = req.body;

    const result = await executeTransfer({
      senderUserId: req.userAuth,
      receiverAccountNumber: accountNumber,
      amount,
      transactionPin,
    });

    return res.status(200).json({
      message: "Transfer successful",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getTransactionsCtrl = async (req, res) => {
  try {
    const { type, category, page = 1, limit = 10, startDate, endDate } = req.query;

    let filter = { user: req.userAuth };

    // filters
    if (type) filter.type = type;
    if (category) filter.category = category;

    // date filter (bank-like history)
    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};


export const lookupAccountCtrl = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    if (!accountNumber) {
      return res.status(400).json({
        message: "Account number is required",
      });
    }

    const wallet = await Wallet.findOne({
      accountNumber,
    }).populate("user", "name");

    if (!wallet) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    return res.status(200).json({
      accountName: wallet.user.name,
      accountNumber: wallet.accountNumber,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error looking up account",
    });
  }
};


export const getWalletAnalyticsCtrl = async (req, res) => {
  try {
    const userId = await User.findById(req.userAuth);

    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    // Total sent
    const totalSentAgg = await Transaction.aggregate([
      {
        $match: {
          user: wallet.user,
          type: "debit",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Total received
    const totalReceivedAgg = await Transaction.aggregate([
      {
        $match: {
          user: wallet.user,
          type: "credit",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalSent = totalSentAgg[0]?.total || 0;
    const totalReceived = totalReceivedAgg[0]?.total || 0;

    // Today filter
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todaySentAgg = await Transaction.aggregate([
      {
        $match: {
          user: wallet.user,
          type: "debit",
          createdAt: { $gte: startOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const todayReceivedAgg = await Transaction.aggregate([
      {
        $match: {
          user: wallet.user,
          type: "credit",
          createdAt: { $gte: startOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    return res.json({
      balance: wallet.balance,
      currency: wallet.currency,
      totalSent,
      totalReceived,
      todaySpent: todaySentAgg[0]?.total || 0,
      todayReceived: todayReceivedAgg[0]?.total || 0,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Analytics error",
    });
  }
};

// get all wallet
export const getAllWalletCtrl = async (req, res) => {
  try {
    const wallets = await Wallet.find();
    return res.json({
      status: "success",
      data: wallets
    })

  } catch (error) {
    return res.json(error.message)
  }
};

export const getVirtualAccountCtrl = async (req, res) => {
  const wallet = await Wallet.findOne({
    user: req.userAuth,
  });
  const user = await User.findById(req.userAuth)

  if (!wallet) {
    return res.status(404).json({
      message: "Wallet not found",
    });
  }

  res.json({
    accountName: user.name,
    accountNumber: wallet.accountNumber,
    bankName: wallet.bankName,
  });
};

export const simulateBankTransferCtrl = async (req, res) => {
  const { accountNumber, amount } = req.body;

  const wallet = await Wallet.findOne({
    accountNumber,
  });

  if (!wallet) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  wallet.balance += Number(amount);

  await wallet.save();

  await Transaction.create({
    user: wallet.user,
    type: "credit",
    category: "wallet_fund",
    amount,
    status: "success",
    reference: generateRef(),
    metadata: {
      source: "bank_transfer",
    },
  });

  res.json({
    message: "Wallet credited successfully",
  });
};