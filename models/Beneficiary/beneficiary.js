import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    bankName: {
      type: String, 
      default: "Demo Bank",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Beneficiary", beneficiarySchema);