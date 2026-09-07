import { educationProviders } from "../../config/educationConfig.js";
import { educationService } from "../../services/education/educationService.js";
import { buyInternetService } from "../../services/internet/internetService.js";
import providerFactory from "../../services/providers/factory/providerFactory.js";

export const educationCtrl = async (req, res) => {
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    try {
        const education = await educationService({
            userId: req.userAuth,
            disco: req.body.disco,
            billersCode: req.body.billersCode,
            // providerId: req.body.providerId,
            variationCode: req.body.variationCode,
            pin: req.body.pin,
            phoneNumber: req.body.phoneNumber,
        });

        return res.status(200).json({
            success: true,
            data: education,
        });
    }
    //  catch (error) {
    //     return res.status(400).json({
    //         success: false,
    //         message: error.message,
    //         provider: error.provider || null,
    //     });
    // }
    catch (error) {
        if (error.provider) {
            return res.status(502).json({
                success: false,
                message: error.message,
                provider: error.provider,
            });
        }

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
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
GET EDUCATION PROVIDERS
=====================================
*/

export const getEducationProvidersCtrl = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: educationProviders,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/*
=====================================
GET EDUCATION PLANS
=====================================
*/

export const getEducationPlansCtrl = async (req, res) => {
    try {
        const { providerId } = req.params;
        const provider = providerFactory("education");
        const plans = await provider.getEducationPlans(providerId);

        return res.status(200).json({
            success: true,
            data: plans,
        });
    } catch (error) {
        console.log("Get Education Plans Error:", error.message);
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};