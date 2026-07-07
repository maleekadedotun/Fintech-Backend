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
    },
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ url: session.url });
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

    const walletId = session.metadata.walletId;
    const amount = session.amount_total / 100;

    const wallet = await Wallet.findById(walletId);
    if (!wallet) return res.status(404).end();

    // CREDIT WALLET
    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
      user: wallet.user,
      type: "credit",
      category: "wallet_fund",
      amount,
      reference: crypto.randomBytes(10).toString("hex"),
      status: "success",
    });

    await WebhookLog.create({
      eventId: event.id,
    });
  }

  res.json({ received: true });
};
