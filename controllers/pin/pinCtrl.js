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
        message: "Transaction PIN created successfully",
        // data: hashedPin,
    });
};


export const sendPinResetOtpCtrl = async (req, res) => {

    try {

        const user = await User.findById(
            req.userAuth
        );

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        // Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // OTP expires in 10 minutes
        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );
        console.log("expire", expiresAt);
        

        user.pinResetOtp = otp;
        user.pinResetOtpExpires = expiresAt;

        await user.save();

        /*
            IMPORTANT:

            For now we log the OTP.

            Later we will send this through
            SMS using your SMS provider.
        */

        console.log(
            `PIN reset OTP for ${user.phoneNumber}: ${otp}`
        );

        return res.status(200).json({

            status: "success",

            message:
                "OTP sent to your registered phone number",

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message:
                "Unable to send PIN reset OTP",

        });

    }

};

export const resetTransactionPinCtrl = async (req, res) => {

    try {

        const {
            otp,
            pin,
        } = req.body;

        if (!otp || !pin) {

            return res.status(400).json({

                message:
                    "OTP and new PIN are required",

            });

        }

        if (!/^\d{6}$/.test(otp)) {

            return res.status(400).json({

                message:
                    "OTP must be 6 digits",

            });

        }

        if (!/^\d{4}$/.test(pin)) {

            return res.status(400).json({

                message:
                    "PIN must be exactly 4 digits",

            });

        }

        const user = await User.findById(
            req.userAuth
        );

        if (!user) {

            return res.status(404).json({

                message:
                    "User not found",

            });

        }

        // Check OTP
        if (user.pinResetOtp !== otp) {

            return res.status(400).json({

                message:
                    "Invalid OTP",

            });

        }

        // Check expiry
        if (
            !user.pinResetOtpExpires ||
            user.pinResetOtpExpires < new Date()
        ) {

            return res.status(400).json({

                message:
                    "OTP has expired",

            });

        }

        // Hash new PIN
        const hashedPin = await bcrypt.hash(
            pin,
            10
        );

        user.transactionPin = hashedPin;

        // Clear OTP after successful reset
        user.pinResetOtp = null;

        user.pinResetOtpExpires = null;

        await user.save();

        return res.status(200).json({

            status: "success",

            message:
                "Transaction PIN reset successfully",

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message:
                "Unable to reset transaction PIN",

        });

    }

};