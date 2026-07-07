import bcrypt from "bcryptjs";
import User from "../models/User/user.js";

const verifyTransactionPin = async (userId, pin) => {
    const user = await User.findById(userId);

    if (!user.transactionPin) {
        throw new Error(
            "Transaction PIN not set"
        );
    }

    const isValid = await bcrypt.compare(
        pin,
        user.transactionPin
    );

    if (!isValid) {
        throw new Error(
            "Invalid transaction PIN"
        );
    }

    return true;
};

export default verifyTransactionPin;