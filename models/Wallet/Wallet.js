import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    accountNumber: {
      type: String,
      unique: true,
      required: true,
    },
    bankName: {
      type: String,
      default: "Fintech Demo Bank",
    },
    // accountName: {
    //   type: String,
    //   default: null,
    // },
    dailyLimit: {
      type: Number,
      default: 50000, // default ₦50,000
    },

    dailySpent: {
      type: Number,
      default: 0,
    },

    lastTransactionDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// export default mongoose.model("Wallet", walletSchema);
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);

export default Wallet;
