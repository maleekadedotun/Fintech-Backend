import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  stripeWebhook,
  verifyPaymentCtrl,
} from "../../controllers/payment/paymentCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";

const paymentRouter = express.Router();

paymentRouter.post("/fund", isLoggedIn, createCheckoutSession);
//  express.raw({ type: "application/json" }),
// Stripe requires RAW body
paymentRouter.post("/webhook", stripeWebhook);
paymentRouter.get("/verify/:sessionId", isLoggedIn, verifyPaymentCtrl);

export default paymentRouter;
