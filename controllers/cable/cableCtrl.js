// import mongoose from "mongoose";
// // import crypto from "crypto";
// // import createNotification from "../../helpers/createNotification.js";
// // import { recordRevenue } from "../../helpers/revenueHelpers.js";
// // import verifyTransactionPin from "../../helpers/verifyTransactionPin.js";
// import { createLedgerEntry } from "../../helpers/ledgerHelper.js";
// import { buyCableService } from "../../services/cable/cableService.js";
// // import { cableService } from "../../services/cable/cableService.js";


// // const generateRef = () => crypto.randomBytes(10).toString("hex");


// export const cableCtrl = async (req, res) => {
//     const session = await mongoose.startSession();

//     try {
//         const transaction = await buyCableService({
//             userId: req.userAuth,
//             pin: req.body.pin,
//             amount: req.body.amount,
//             providerId: req.body.providerId,
//             smartCardNumber: req.body.smartCardNumber,
//             planId: req.body.planId,
//         });

//         return res.status(200).json({
//             message: "Airtime purchase successful",
//             data: transaction,
//         });
//     } catch (error) {
//         if (session && session.inTransaction()) {
//             await session.abortTransaction();
//         }


//         res.status(error.statusCode || 500).json({
//             success: false,
//             message: error.message,
//             provider: error.provider || null,
//         });
//         // return error;

//         // return res.status(400).json({
//         //   message: error.message,
//         // });
//     } finally {
//         session.endSession();
//     }
// };

import {
    buyCableService,
} from "../../services/cable/cableService.js";
import providerFactory from "../../services/providers/factory/providerFactory.js";
import { cableProviders } from "../../config/cableConfig.js";


export const buyCableCtrl = async (req, res) => {

    try {

        const transaction = await buyCableService({

            userId: req.userAuth,

            providerId: req.body.providerId,

            smartCardNumber: req.body.smartCardNumber,
            variationCode: req.body.variationCode,
            plan: req.body.plan,
            planId: req.body.planId,
            phoneNumber: req.body.phoneNumber,

            // amount: req.body.amount,

            pin: req.body.pin,

        });

        return res.status(200).json({

            success: true,

            message: "Cable subscription successful",

            data: transaction,

        });

    } catch (error) {

        return res.status(error.statusCode || 400).json({

            success: false,

            message: error.message,

            provider: error.provider || null,

        });

    }

};

// export const getCableProvidersCtrl = async (req, res) => {

//     try {

//         const provider = providerFactory("cable");
//         console.log(provider, "Provider");


//         const providers =
//             await provider.getCableProviders();

//         return res.json(providers);

//     } catch (error) {

//         return res.status(400).json({

//             message: error.message,

//         });

//     }

// };


export const getCableProvidersCtrl = (req, res) => {

    const providers = Object.entries(cableProviders).map(
        ([id, serviceID]) => ({
            id: isNaN(Number(id)) ? id : Number(id),
            serviceID,
            name:
                serviceID.charAt(0).toUpperCase() +
                serviceID.slice(1),
        })
    );

    return res.json(providers);
};

export const getCablePlansCtrl = async (req, res) => {

    try {

        const provider = providerFactory("cable");

        const plans =
            await provider.getCablePlans(
                req.params.providerId
            );
        // console.log(plans, "Plans");


        return res.status(200).json({
            status: "success",
            data: plans
        });

    } catch (error) {

        return res.status(400).json({

            message: error.message,

        });

    }

};

// export const getCablePlansCtrl = async (req, res) => {

//     const provider = providerFactory("cable");

//     const plans = await provider.getCablePlans(
//         req.params.providerId
//     );

//     return res.json(plans);
// };

export const verifyCableCustomerCtrl = async (
    req,
    res
) => {

    try {

        const provider = providerFactory("cable");

        const customer =
            await provider.verifySmartCard({

                providerId: req.body.providerId,

                smartCardNumber:
                    req.body.smartCardNumber,

            });

        return res.json(customer);

    } catch (error) {

        return res.status(400).json({

            message: error.message,

        });

    }

};