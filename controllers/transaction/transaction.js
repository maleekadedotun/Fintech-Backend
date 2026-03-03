import Transaction from "../../models/Transaction.js/transaction.js";
import User from "../../models/User/user.js";
import Wallet from "../../models/Wallet/Wallet.js";
import crypto from "crypto";

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
//   const { receiverEmail, amount } = req.body;

//   if (amount <= 0) {
//     return res.status(400).json({ message: "Invalid amount" });
//   }

//   const senderWallet = await Wallet.findOne({ user: req.userAuth }).populate(
//     "user"
//   );

//   if (senderWallet.balance < amount) {
//     return res.status(400).json({ message: "Insufficient balance" });
//   }

//   // Find receiver
//   const receiverWallet = await Wallet.findOne()
//     .populate({
//       path: "user",
//       match: { email: receiverEmail },
//     });

//   if (!receiverWallet || !receiverWallet.user) {
//     return res.status(404).json({ message: "Receiver not found" });
//   }

//   // Debit sender
//   senderWallet.balance -= amount;
//   await senderWallet.save();

//   // Credit receiver
//   receiverWallet.balance += amount;
//   await receiverWallet.save();

//   const reference = generateRef();

//   const transferFunds = await Transaction.create([
//     {
//       user: senderWallet.user._id,
//       type: "debit",
//       category: "transfer",
//       amount,
//       reference,
//     },
//     {
//       user: receiverWallet.user._id,
//       type: "credit",
//       category: "transfer",
//       amount,
//       reference,
//     },
//   ]);

//     res.json({ message: "Transfer successful",
//         data: transferFunds,
//     });
// };

export const transferFundsCtrl = async (req, res) => {
  const { receiverEmail, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const senderWallet = await Wallet.findOne({ user: req.userAuth });

  if (!senderWallet) {
    return res.status(404).json({ message: "Sender wallet not found" });
  }

  if (senderWallet.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  const receiverUser = await User.findOne({ email: receiverEmail });
  if (!receiverUser) {
    return res.status(404).json({ message: "Receiver not found" });
  }

  const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
  if (!receiverWallet) {
    return res.status(404).json({ message: "Receiver wallet not found" });
  }

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();

  const reference = generateRef();

  const transferFunds = await Transaction.create([
    {
      user: senderWallet.user,
      type: "debit",
      category: "transfer",
      amount,
      reference,
    },
    {
      user: receiverWallet.user,
      type: "credit",
      category: "transfer",
      amount,
      reference,
    },
  ]);

    res.json({ message: "Transfer successful",
        data: transferFunds,
    });
};

