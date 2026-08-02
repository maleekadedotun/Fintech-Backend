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
        console.log(error, "error");
        
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
            provider: error.provider || null,
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