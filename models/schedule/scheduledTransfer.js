import mongoose from "mongoose";

const scheduledTransferSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverAccountNumber: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    frequency: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly"],
      default: "once",
    },

    nextRun: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ScheduledTransfer", scheduledTransferSchema);