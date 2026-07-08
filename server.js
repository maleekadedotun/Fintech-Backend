import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// import { initializeSocket } from "./socket/socket.js";
import morgan from "morgan";
import connectDB from "./config/dbConnect.js";
import userRouter from "./routes/auth/userRoutes.js";
import walletRouter from "./routes/wallet/walletRoutes.js";
import paymentRouter from "./routes/payment/paymentRoute.js";
import beneficiaryRouter from "./routes/beneficiary/beneficiaryRoute.js";
import airTimeRouter from "./routes/airTime/airTimeRoute.js";
import dataPlanRouter from "./routes/dataPlan/dataPlanRoute.js";
import kycRouter from "./routes/kyc/kycRoutes.js";
import notificationRoutes from "./routes/notification/notificationRoutes.js";
import adminRouter from "./routes/admin/adminRoutes.js";
import ledgerRouter from "./routes/ledger/ledgerRoutes.js";
import withdrawalRoutes from "./routes/withdrawal/withdrawalRoutes.js";
import pinRoutes from "./routes/pin/pinRoutes.js";
import statementRoutes from "./routes/statement/statementRoutes.js";
import scheduleRoutes from "./routes/schedule/scheduleRoutes.js";
import "./cron/scheduleTransferCron.js";
import { initializeSocket } from "./socket/socket.js";
import testRouter from "./routes/test/testRoutes.js";
// import stripe from "./config/stripe.js";

connectDB();

const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// web hook stripe payment
app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));



// routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/beneficiary", beneficiaryRouter);
app.use("/api/v1/airtime", airTimeRouter);
app.use("/api/v1/data", dataPlanRouter);
app.use("/api/v1/kyc", kycRouter);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/ledger", ledgerRouter);
app.use("/api/v1/withdrawal", withdrawalRoutes);
app.use("/api/v1/pin", pinRoutes);
app.use("/api/v1/statement", statementRoutes);
app.use("/api/v1/schedule", scheduleRoutes);
app.use("/api/v1/test", testRouter);
// console.log("Stripe key:", process.env.STRIPE_SECRET_KEY);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

app.get("/", (req, res) => {
  res.json({ status: "Fintech API running 🚀" });
});

const PORT = process.env.PORT || 6000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
