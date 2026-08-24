import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    tier: {
      type: Number,
      default: 1,
    },

    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    idType: {
      type: String,
      default: null,
    },

    idNumber: {
      type: String,
      default: null,
    },

    transactionPin: {
      type: String,
      default: null,
    },
    pinResetOtp: {
      type: String,
      default: null,
    },

    pinResetOtpExpires: {
      type: Date,
      default: null,
    },
    isFrozen: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);


export default mongoose.model("User", userSchema);
