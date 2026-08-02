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