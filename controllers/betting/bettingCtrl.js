import { buyBettingService } from "../../services/betting/bettingService.js";

export const buyBettingCtrl = async (req, res) => {
    try {
        const result = await buyBettingService({
            userId: req.userAuth,
            providerId: req.body.providerId,
            customerId: req.body.customerId,
            amount: req.body.amount,
            phoneNumber: req.body.phoneNumber,
            pin: req.body.pin,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            provider: error.provider || null,
        });
    }
};