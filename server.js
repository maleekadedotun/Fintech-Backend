import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first

import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/dbConnect.js";
import userRouter from "./routes/auth/userRoutes.js";
import walleRouter from "./routes/wallet/walletRoutes.js";
import paymentRouter from "./routes/payment/paymentRoute.js";
// import stripe from "./config/stripe.js";

connectDB();

const app = express();
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/wallet", walleRouter);
app.use("/api/v1/payment", paymentRouter);
// console.log("Stripe key:", process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.json({ status: "Fintech API running 🚀" });
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
