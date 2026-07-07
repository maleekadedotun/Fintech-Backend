import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["airtime", "data", "transfer", "wallet_funding"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    cost: {
      type: Number,
      required: true,
    },

    profit: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Revenue", revenueSchema);