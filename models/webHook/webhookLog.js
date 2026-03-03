import mongoose from "mongoose";

const webhookLogSchema = new mongoose.Schema(
  {
    eventId: { type: String, unique: true },
    provider: { type: String, default: "stripe" },
  },
  { timestamps: true }
);

export default mongoose.model("WebhookLog", webhookLogSchema);
