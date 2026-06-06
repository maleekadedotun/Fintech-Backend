import Transaction from "../../models/Transaction.js/transaction.js";
import User from "../../models/User/user.js";
import Wallet from "../../models/Wallet/Wallet.js";
import crypto from "crypto";
import mongoose from "mongoose";


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

// export const getWalletCtrl = async (req, res) => {
//   const wallet = await Wallet.findOne({ user: req.userAuth });

//   if (!wallet) {
//     return res.status(404).json({ message: "Wallet not found" });
//   }

//   const balance = Number(wallet.balance || 0);

//   res.json({
//     balance,
//     currency: wallet.currency,
//   });
// };

// INTERNAL CREDIT (used later by Stripe webhook)
export const creditWalletCtrl = async (req, res) => {
  const { amount, category } = req.body;
  const wallet = await Wallet.findOne({ user: req.userAuth });
  if (!wallet) throw new Error("Wallet not found");

  //   wallet.balance += amount;
  wallet.balance = wallet.balance + Number(amount);

  await wallet.save();

  const transaction = await Transaction.create({
    user: req.userAuth,
    type: "credit",
    category,
    amount,
    reference: generateRef(),
    status: "success",
  });
  res.json({
    message: "Wallet credited successfully",
    data: transaction,
  })
};

// @desc Transfer money (P2P)
// @route POST /api/wallet/transfer

// export const transferFundsCtrl = async (req, res) => {
//   let { receiverEmail, amount } = req.body;

//   // Convert amount to a number
//   amount = Number(amount);

//   if (isNaN(amount) || amount <= 0) {
//     return res.status(400).json({ message: "Invalid amount" });
//   }

//   const senderWallet = await Wallet.findOne({ user: req.userAuth });

//   if (!senderWallet) {
//     return res.status(404).json({ message: "Sender wallet not found" });
//   }

//   if (senderWallet.balance < amount) {
//     return res.status(400).json({ message: "Insufficient balance" });
//   }

//   const receiverUser = await User.findOne({ email: receiverEmail });

//   if (!receiverUser) {
//     return res.status(404).json({ message: "Receiver not found" });
//   }

//   const receiverWallet = await Wallet.findOne({
//     user: receiverUser._id,
//   });

//   if (!receiverWallet) {
//     return res.status(404).json({
//       message: "Receiver wallet not found",
//     });
//   }

//   // Ensure balances are treated as numbers
//   senderWallet.balance = Number(senderWallet.balance) - amount;
//   receiverWallet.balance =
//     Number(receiverWallet.balance) + amount;

//   await senderWallet.save();
//   await receiverWallet.save();

//   const reference = generateRef();

//   const transferFunds = await Transaction.create([
//     {
//       user: senderWallet.user,
//       type: "debit",
//       category: "transfer",
//       amount,
//       reference,
//     },
//     {
//       user: receiverWallet.user,
//       type: "credit",
//       category: "transfer",
//       amount,
//       reference,
//     },
//   ]);

//   res.json({
//     message: "Transfer successful",
//     data: transferFunds,
//   });
// };


// export const transferFundsCtrl = async (req, res) => {
//   const { receiverEmail, amount } = req.body;

//   const transferAmount = Number(amount);

//   if (transferAmount <= 0) {
//     return res.status(400).json({ message: "Invalid amount" });
//   }

//   try {
//     // 1. Sender wallet
//     const senderWallet = await Wallet.findOne({ user: req.userAuth });

//     if (!senderWallet) {
//       return res.status(404).json({ message: "Sender wallet not found" });
//     }

//     if (senderWallet.balance < transferAmount) {
//       return res.status(400).json({ message: "Insufficient balance" });
//     }

//     // 2. Receiver user
//     const receiverUser = await User.findOne({ email: receiverEmail });

//     if (!receiverUser) {
//       return res.status(404).json({ message: "Receiver not found" });
//     }

//     const receiverWallet = await Wallet.findOne({
//       user: receiverUser._id,
//     });

//     if (!receiverWallet) {
//       return res.status(404).json({ message: "Receiver wallet not found" });
//     }

//     const reference = generateRef();

//     // 3. Create PENDING transactions FIRST
//     const senderTx = await Transaction.create({
//       user: senderWallet.user,
//       type: "debit",
//       category: "transfer",
//       amount: transferAmount,
//       reference,
//       status: "pending",
//       metadata: {
//         receiver: receiverEmail,
//       },
//     });

//     const receiverTx = await Transaction.create({
//       user: receiverWallet.user,
//       type: "credit",
//       category: "transfer",
//       amount: transferAmount,
//       reference,
//       status: "pending",
//       metadata: {
//         sender: senderWallet.user,
//       },
//     });

//     // 4. Perform wallet updates
//     senderWallet.balance -= transferAmount;
//     receiverWallet.balance += transferAmount;

//     await senderWallet.save();
//     await receiverWallet.save();

//     // 5. Mark transactions SUCCESS
//     senderTx.status = "success";
//     receiverTx.status = "success";

//     await senderTx.save();
//     await receiverTx.save();

//     return res.json({
//       message: "Transfer successful",
//       reference,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       message: "Transfer failed",
//     });
//   }
// };

// export const transferFundsCtrl = async (req, res) => {
//   const { accountNumber, amount } = req.body;

//   const transferAmount = Number(amount);

//   if (!accountNumber) {
//     return res.status(400).json({ message: "Account number is required" });
//   }

//   if (transferAmount <= 0) {
//     return res.status(400).json({ message: "Invalid amount" });
//   }

//   try {
//     // 1. Sender wallet
//     const senderWallet = await Wallet.findOne({ user: req.userAuth });

//     if (!senderWallet) {
//       return res.status(404).json({ message: "Sender wallet not found" });
//     }

//     if (senderWallet.balance < transferAmount) {
//       return res.status(400).json({ message: "Insufficient balance" });
//     }

//     // 2. Receiver wallet (BY ACCOUNT NUMBER)
//     const receiverWallet = await Wallet.findOne({
//       accountNumber,
//     });

//     if (!receiverWallet) {
//       return res.status(404).json({ message: "Invalid account number" });
//     }

//     // prevent sending to self
//     if (senderWallet.accountNumber === accountNumber) {
//       return res.status(400).json({
//         message: "You cannot transfer to yourself",
//       });
//     }

//     const reference = generateRef();

//     // 3. Create PENDING transactions
//     const senderTx = await Transaction.create({
//       user: senderWallet.user,
//       type: "debit",
//       category: "transfer",
//       amount: transferAmount,
//       reference,
//       status: "pending",
//       metadata: {
//         accountNumber,
//       },
//     });

//     const receiverTx = await Transaction.create({
//       user: receiverWallet.user,
//       type: "credit",
//       category: "transfer",
//       amount: transferAmount,
//       reference,
//       status: "pending",
//       metadata: {
//         senderAccountNumber: senderWallet.accountNumber,
//       },
//     });

//     // 4. Update wallets
//     senderWallet.balance -= transferAmount;
//     receiverWallet.balance += transferAmount;

//     await senderWallet.save();
//     await receiverWallet.save();

//     // 5. Mark transactions SUCCESS
//     senderTx.status = "success";
//     receiverTx.status = "success";

//     await senderTx.save();
//     await receiverTx.save();

//     return res.json({
//       message: "Transfer successful",
//       reference,
//       from: senderWallet.accountNumber,
//       to: receiverWallet.accountNumber,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       message: "Transfer failed",
//     });
//   }
// };


export const transferFundsCtrl = async (req, res) => {
  let { accountNumber, amount } = req.body;

  amount = Number(amount);

  if (!accountNumber) {
    return res.status(400).json({ message: "Account number is required" });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderWallet = await Wallet.findOne({ user: req.userAuth }).session(session);

    if (!senderWallet) {
      throw new Error("Sender wallet not found");
    }

    const receiverWallet = await Wallet.findOne({ accountNumber }).session(session);

    if (!receiverWallet) {
      throw new Error("Invalid account number");
    }

    if (senderWallet.accountNumber === accountNumber) {
      return res.status(400).json({ message: "You cannot transfer to yourself" });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const reference = generateRef();

    // atomic updates inside transaction
    await Wallet.updateOne(
      { user: senderWallet.user },
      { $inc: { balance: -amount } },
      { session }
    );

    await Wallet.updateOne(
      { accountNumber },
      { $inc: { balance: amount } },
      { session }
    );

    await Transaction.insertMany(
      [
        {
          user: senderWallet.user,
          type: "debit",
          category: "transfer",
          amount,
          reference,
          status: "success",
          metadata: { accountNumber },
        },
        {
          user: receiverWallet.user,
          type: "credit",
          category: "transfer",
          amount,
          reference,
          status: "success",
          metadata: {
            senderAccountNumber: senderWallet.accountNumber,
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Transfer successful",
      reference,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: error.message || "Transfer failed",
    });
  }
};


export const getTransactionsCtrl = async (req, res) => {
  try {
    const { type, category } = req.query;

    // build filter dynamically
    let filter = { user: req.userAuth };

    if (type) {
      filter.type = type; // credit or debit
    }

    if (category) {
      filter.category = category; // transfer, wallet_fund, etc.
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(50); // simple safety limit for now

    res.json({
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


