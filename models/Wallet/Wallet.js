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
    }
  },
  { timestamps: true }
);

// export default mongoose.model("Wallet", walletSchema);
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);

export default Wallet;
