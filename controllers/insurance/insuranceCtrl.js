// import { insuranceService } from "../../services/insurance/insuranceService.js";

import { insuranceService } from "../../services/insurance/insuranceService.js";

export const insuranceCtrl = async (req, res) => {
    console.log(req.body);

    try {
        const insurance = await insuranceService({
            userId: req.userAuth,

            providerId: req.body.providerId,

            billersCode: req.body.billersCode,

            variationCode: req.body.variationCode,

            phoneNumber: req.body.phoneNumber,

            pin: req.body.pin,

            insuredName: req.body.insuredName,

            email: req.body.email,

            plateNumber: req.body.plateNumber,

            chassisNumber: req.body.chassisNumber,

            engineCapacity: req.body.engineCapacity,

            vehicleMake: req.body.vehicleMake,

            vehicleModel: req.body.vehicleModel,

            vehicleColor: req.body.vehicleColor,

            yearOfMake: req.body.yearOfMake,

            state: req.body.state,

            lga: req.body.lga,
        });

        return res.status(200).json({
            success: true,
            data: insurance,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            provider: error.provider || null,
        });
    }
};