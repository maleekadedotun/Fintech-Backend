import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

    reference: {
      type: String,
      required: true,
    },

    entryType: {
      type: String,
      enum: ["debit", "credit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    balanceBefore: {
      type: Number,
      required: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
    },

    narration: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ledger", ledgerSchema);