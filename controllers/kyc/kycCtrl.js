import User from "../../models/User/user.js";
import createNotification from "../../helpers/createNotification.js";


export const submitKYCCtrl = async (req, res) => {

    try {
        const { idType, idNumber } = req.body;

        const user = await User.findById(req.userAuth);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.idType = idType;
        user.idNumber = idNumber;
        user.kycStatus = "pending";

        await user.save();

        res.json({
            message: "KYC submitted successfully",
            status: user.kycStatus,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyKYCCtrl = async (req, res) => {
    try {
        // const { userId } = req.params;
        const user = await User.findById(req.userAuth);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.kycStatus = "verified";
        user.tier = 2;

        await user.save();

        await createNotification(
            user._id,
            "KYC Approved",
            "Your account has been upgraded successfully"
        );

        res.json({
            message: "KYC approved",
            tier: user.tier,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};