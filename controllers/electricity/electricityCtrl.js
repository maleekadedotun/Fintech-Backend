import { buyElectricityService } from "../../services/electricity/electricityService.js";
import providerFactory from "../../services/providers/factory/providerFactory.js";

export const buyElectricityCtrl = async (req, res) => {
    try {
        const transaction = await buyElectricityService({
            userId: req.userAuth,
            disco: req.body.disco,
            meterNumber: req.body.meterNumber,
            meterType: req.body.meterType,
            amount: req.body.amount,
            phoneNumber: req.body.phoneNumber,
            pin: req.body.pin,
        });

        return res.status(200).json({
            success: true,
            message: "Electricity purchase successful",
            data: transaction,
        });

    } catch (error) {
        console.log("Electricity Controller Error:", error);
        
        const message =
            error.response?.data?.response_description ||
            error.response?.data?.message ||
            error.response?.data?.msg ||
            error.message ||
            "Electricity purchase failed";

        return res.status(error.statusCode || error.response?.status || 400).json({
            success: false,
            message,
            provider: error.provider || error.response?.data || null,
        });
    }
};

export const verifyMeterCtrl = async (req, res) => {
    try {
        const provider = providerFactory("electricity");

        const customer = await provider.verifyMeter({
            disco: req.body.disco,
            meterNumber: req.body.meterNumber,
            meterType: req.body.meterType,
        });

        return res.json(customer);

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};