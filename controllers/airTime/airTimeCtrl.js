import mongoose from "mongoose";
import Wallet from "../../models/Wallet/Wallet.js";
import Transaction from "../../models/Transaction/Transaction.js";
import crypto from "crypto";
import createNotification from "../../helpers/createNotification.js";
import { recordRevenue } from "../../helpers/revenueHelpers.js";
// import { createLedgerEntry } from "../../helpers/ledgerHelper.js";
import verifyTransactionPin from "../../helpers/verifyTransactionPin.js";
import { createLedgerEntry } from "../../helpers/ledgerHelper.js";
import User from "../../models/User/user.js";
import { buyAirtimeService } from "../../services/airtimeService.js";


const generateRef = () => crypto.randomBytes(10).toString("hex");


export const buyAirTimeCtrl = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const transaction = await buyAirtimeService({

      userId: req.userAuth,
      phoneNumber: req.body.phoneNumber,
      network: req.body.network,
      amount: req.body.amount,
      pin: req.body.pin,
    });
    // session.startTransaction();
    // const user = await User.findById(req.userAuth);
    // if (user.isFrozen) {
    //   throw new Error("Account is frozen.");
    // }

    // const { phoneNumber, network, amount, pin } = req.body;

    // const airtimeAmount = Number(amount);

    // await verifyTransactionPin(
    //   req.userAuth,
    //   pin
    // );

    // if (!phoneNumber || !network) {
    //   throw new Error("Phone number and network are required");
    // }

    // if (
    //   !["MTN", "Airtel", "Glo", "9mobile"].includes(network)
    // ) {
    //   throw new Error("Invalid network");
    // }

    // if (isNaN(airtimeAmount) || airtimeAmount <= 0) {
    //   throw new Error("Invalid amount");
    // }

    // const wallet = await Wallet.findOne({
    //   user: req.userAuth,
    // }).session(session);

    // if (!wallet) {
    //   throw new Error("Wallet not found");
    // }

    // if (wallet.balance < airtimeAmount) {
    //   throw new Error("Insufficient balance");
    // }

    // // Debit wallet
    // wallet.balance -= airtimeAmount;

    // await wallet.save({ session });

    // // Record transaction
    // const transaction = await Transaction.create(
    //   [
    //     {
    //       user: req.userAuth,
    //       type: "debit",
    //       category: "airtime",
    //       amount: airtimeAmount,
    //       status: "success",
    //       reference: generateRef(),
    //       metadata: {
    //         phoneNumber,
    //         network,
    //       },
    //     },
    //   ],
    //   { session }
    // );

    // // Future VTU integration goes here

    // await session.commitTransaction();

    // await createNotification(
    //   req.userAuth,
    //   "Airtime Purchase",
    //   `₦${amount} airtime purchased for ${phoneNumber}`
    // );

    // const revenueAmount = Number(req.body.amount);
    // const costPrice = amount * 0.98; // provider gives discount
    // // const reference = generateRef();


    // await recordRevenue({
    //   type: "airtime",
    //   amount: revenueAmount,
    //   cost: costPrice,
    //   reference: generateRef(),
    //   user: req.userAuth,
    // });

    // // Ledger
    // const senderWallet = await Wallet.findOne({ user: req.userAuth }).session(session);

    // const balanceBefore = senderWallet.balance;
    // // const receiverBefore = receiverWallet.balance;
    // // Receiver
    // const balanceAfter = balanceBefore - airtimeAmount;
    // // const receiverAfter = receiverBefore + amount;
    // await createLedgerEntry({
    //   user: req.userAuth,
    //   reference: generateRef(),
    //   entryType: "debit",
    //   amount,
    //   balanceBefore,
    //   balanceAfter,
    //   narration: `Airtime purchase`,
    // });

    return res.status(200).json({
      message: "Airtime purchase successful",
      data: transaction,
    });
  } catch (error) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();

    }

    return res.status(400).json({
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};