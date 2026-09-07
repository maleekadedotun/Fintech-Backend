import bcrypt from "bcryptjs";
import User from "../models/User/user.js";

const verifyTransactionPin = async (userId, pin) => {
    if (!pin || (typeof pin !== "string" && typeof pin !== "number")) {
        throw new Error("Transaction PIN is required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.transactionPin) {
        throw new Error("Transaction PIN not set");
    }

    const isValid = await bcrypt.compare(
        String(pin),
        user.transactionPin
    );

    if (!isValid) {
        throw new Error("Invalid transaction PIN");
    }

    return true;
};

export default verifyTransactionPin;