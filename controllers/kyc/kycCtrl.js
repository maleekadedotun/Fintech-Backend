import User from "../../models/User/user.js";
import createNotification from "../../helpers/createNotification.js";


export const submitKYCCtrl = async (req, res) => {
    try {
        const { idType, idNumber } = req.body;

        const user = await User.findById(req.userAuth);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.kycStatus === "verified") {
            return res.status(400).json({ message: "KYC already verified" });
        }

        user.idType = idType;
        user.idNumber = idNumber;
        user.kycStatus = "pending";

        await user.save();

        res.json({
            message: "KYC submitted successfully. Awaiting admin review.",
            status: user.kycStatus,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: list all pending KYC submissions
export const getPendingKYCCtrl = async (req, res) => {
    try {
        const pendingUsers = await User.find({ kycStatus: "pending", idNumber: { $ne: null } })
            .select("name email phoneNumber idType idNumber kycStatus tier createdAt")
            .sort({ createdAt: -1 });

        res.json({
            message: "Pending KYC submissions",
            count: pendingUsers.length,
            data: pendingUsers,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: approve a user's KYC — uses req.params.userId (not the admin's own ID)
export const verifyKYCCtrl = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.kycStatus === "verified") {
            return res.status(400).json({ message: "User KYC is already verified" });
        }

        user.kycStatus = "verified";
        user.tier = 2;

        await user.save();

        await createNotification(
            user._id,
            "KYC Approved ✅",
            "Your identity has been verified. Your account has been upgraded to Tier 2."
        );

        res.json({
            message: "KYC approved successfully",
            userId: user._id,
            tier: user.tier,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: reject a user's KYC
export const rejectKYCCtrl = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.kycStatus = "rejected";
        // Clear submitted ID so the user can re-submit
        user.idType = null;
        user.idNumber = null;

        await user.save();

        await createNotification(
            user._id,
            "KYC Rejected ❌",
            reason || "Your KYC submission was rejected. Please re-submit with valid ID documents."
        );

        res.json({
            message: "KYC rejected",
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};