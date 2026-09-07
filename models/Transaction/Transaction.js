import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    category: {
      type: String,
      enum: ["wallet_fund", "transfer", "airtime", "data", "cable", "electricity", "internet", "education", "betting", "insurance",],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    narration: {
      type: String,
      // required: true,
    },

    reference: {
      type: String,
      required: true,
      // unique: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    reversed: {
      type: Boolean,
      default: false,
    },

    reversalReference: {
      type: String,
    },
    metadata: {
      type: Object,
      default: {},
    },
    reversed: {
      type: Boolean,
      default: false,
    },

    reversedAt: {
      type: Date,
    },

    reversedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reversalReference: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);