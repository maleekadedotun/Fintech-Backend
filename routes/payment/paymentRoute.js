import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../../controllers/payment/paymentCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";

const paymentRouter = express.Router();

paymentRouter.post("/fund", isLoggedIn, createCheckoutSession);

// Stripe requires RAW body
paymentRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default paymentRouter;
