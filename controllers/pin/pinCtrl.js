import bcrypt from "bcryptjs";
import User from "../../models/User/user.js";

export const setTransactionPinCtrl = async (req, res) => {
    const { pin } = req.body;

    if (!pin || pin.length !== 4) {
        return res.status(400).json({
            message: "PIN must be 4 digits",
        });
    }

    const user = await User.findById(
        req.userAuth
    );

    const hashedPin = await bcrypt.hash(pin, 10);

    user.transactionPin = hashedPin;

    await user.save();

    res.json({
        status: "success",
        message:"Transaction PIN created successfully",
        data: hashedPin,
    });
};