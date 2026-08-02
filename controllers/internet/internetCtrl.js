import { buyInternetService } from "../../services/internet/internetService.js";
import providerFactory from "../../services/providers/factory/providerFactory.js";

export const buyInternetCtrl = async (req, res) => {
    try {
        const transaction = await buyInternetService({
            userId: req.userAuth,
            disco: req.body.disco,
            billersCode:req.body.billersCode,
            providerId: req.body.providerId,
            // serviceId: req.body.serviceId,
            variationCode: req.body.variationCode,
            // amount: req.body.amount,
            pin: req.body.pin,
            phoneNumber: req.body.phoneNumber,
        });

        return res.status(200).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            provider: error.provider || null,
        });
    }
};


export const verifyInternetCtrl = async (req, res) => {
    console.log(req.body);
    try {
        const provider = providerFactory("internet");

        const customer = await provider.verifyInternet({
            disco: req.body.disco,
            serviceID: req.body.serviceID,
            billersCode: req.body.billersCode,
        });

        return res.json(customer);

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};