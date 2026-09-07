import { buyInternetService } from "../../services/internet/internetService.js";
import providerFactory from "../../services/providers/factory/providerFactory.js";
import { getInternetPlans } from "../../services/providers/vtpass/internet.js";
import { internetProviders } from "../../config/internetConfig.js";

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

/*
=====================================
GET INTERNET PLANS
=====================================
*/

export const getInternetPlansCtrl = async (req, res) => {
    try {

        const { providerId } = req.params;

        const plans = await getInternetPlans(providerId);

        return res.status(200).json({
            success: true,
            data: plans,
        });

    } catch (error) {

        console.log("Get Internet Plans Error:", error.message);

        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

/*
=====================================
GET INTERNET PROVIDERS
=====================================
*/

export const getInternetProvidersCtrl = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: internetProviders,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};