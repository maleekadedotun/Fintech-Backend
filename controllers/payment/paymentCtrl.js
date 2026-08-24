// import stripe from "../config/stripe.js";
// import stripe from "../../config/stripe.js";
import Stripe from "stripe";

import Wallet from "../../models/Wallet/Wallet.js";
// import Transaction from "../models/Transaction.js";
// import WebhookLog from "../models/WebhookLog.js";
import crypto from "crypto";
import WebhookLog from "../../models/webHook/webhookLog.js";
import Transaction from "../../models/Transaction/Transaction.js";

import dotenv from "dotenv";
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// console.log("stripe:", stripe);

// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  const { amount } = req.body;

  const reference = crypto.randomBytes(10).toString("hex");

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const wallet = await Wallet.findOne({ user: req.userAuth });
  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "ngn",
          product_data: { name: "Wallet Funding" },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      walletId: wallet._id.toString(),
      accountNumber: wallet.accountNumber,
      reference,
    },
    // success_url: `http://localhost:3000/success?amount=${amount}`,
    success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({
    url: session.url,
    sessionId: session.id,
  });
};

// STRIPE WEBHOOK
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Prevent duplicate processing
  const processed = await WebhookLog.findOne({ eventId: event.id });
  if (processed) {
    return res.json({ received: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("===== CHECKOUT COMPLETED =====");

    console.log("Stripe Session ID:", session.id);

    console.log("Wallet ID:", session.metadata.walletId);

    console.log("Reference:", session.metadata.reference);

    console.log("Amount from Stripe:", session.amount_total);

    console.log(
      "Amount to credit:",
      session.amount_total / 100
    );

    const walletId = session.metadata.walletId;
    const amount = session.amount_total / 100;

    const wallet = await Wallet.findById(walletId);
    // if (!wallet) return res.status(404).end();
    if (!wallet) {
      console.log("Wallet not found:", walletId);
      return res.status(404).end();
    }

    const balanceBefore = wallet.balance;
    // CREDIT WALLET
    wallet.balance += amount;
    await wallet.save();

    console.log(
      "Wallet balance before:",
      balanceBefore
    );

    const transaction = await Transaction.create({
      user: wallet.user,
      type: "credit",
      category: "wallet_fund",
      amount,
      // reference: crypto.randomBytes(10).toString("hex"),
      reference: session.metadata.reference,
      status: "success",
    });
    console.log("Transaction created:", transaction);

    await WebhookLog.create({
      eventId: event.id,
    });
  }

  res.json({ received: true });
};


// verify payment
// export const verifyPaymentCtrl = async (req, res) => {
//   try {
//     const { sessionId } = req.params;

//     const session = await stripe.checkout.sessions.retrieve(
//       sessionId
//     );

//     if (!session) {
//       return res.status(404).json({
//         message: "Payment session not found",
//       });
//     }

//     return res.status(200).json({
//       message: "Payment status retrieved",
//       data: {
//         sessionId: session.id,
//         status: session.payment_status,
//         amount: session.amount_total / 100,
//         currency: session.currency,
//       },
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const verifyPaymentCtrl = async (req, res) => {
  try {

    const { sessionId } = req.params;

    // const session =
    //   await stripe.checkout.sessions.retrieve(
    //     sessionId
    //   );



    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log(
      "Stripe session metadata:",
      session.metadata
    );

    console.log(
      "Stripe payment status:",
      session.payment_status
    );

    if (!session) {
      return res.status(404).json({
        message: "Payment session not found",
      });
    }

    // console.log("Stripe session:", session);
    // console.log("Session status:", session.status);
    // console.log("Payment status:", session.payment_status);
    // console.log("Amount total:", session.amount_total);
    // console.log("Metadata:", session.metadata);
    // console.log("PAYMENT INTENT:", session.payment_intent);

    const transaction =
      await Transaction.findOne({
        reference: session.metadata?.reference,
        user: req.userAuth,
      });

    return res.status(200).json({

      message: "Payment status retrieved",

      data: {

        sessionId: session.id,

        status: session.payment_status,

        amount: session.amount_total / 100,

        currency: session.currency,

        walletCredited: !!transaction,

        transaction: transaction || null,

      },

    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};