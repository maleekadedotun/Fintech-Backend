import executeBillPayment from "../../helpers/executeBillPayment.js";
import providerFactory from "../providers/factory/providerFactory.js";
import { getInsurancePlans } from "../providers/vtpass/insurance.js";

export const insuranceService = async ({
    userId,
    providerId,
    billersCode,
    variationCode,
    phoneNumber,
    pin,

    insuredName,
    email,
    plateNumber,
    chassisNumber,
    engineCapacity,
    vehicleMake,
    vehicleModel,
    vehicleColor,
    yearOfMake,
    state,
    lga,
}) => {

    const provider = providerFactory("insurance");

    const plans = await provider.getInsurancePlans(providerId);

    const plan = plans.find(
        p => p.code === variationCode
    );

    if (!plan) {
        throw new Error("Invalid insurance plan");
    }

    const amount = plan.amount;

    return executeBillPayment({

        userId,
        pin,
        amount,

        category: "insurance",

        metadata: {
            providerId,
            variationCode,
            billersCode,
            phoneNumber,
        },

        providerAction: ({ reference, user }) =>

            provider.purchaseInsurance({

                providerId,

                billersCode,

                variationCode,

                amount,

                phoneNumber: user.phoneNumber,

                reference,

                insuredName,

                email,

                plateNumber,

                chassisNumber,

                engineCapacity,

                vehicleMake,

                vehicleModel,

                vehicleColor,

                yearOfMake,

                state,

                lga,
            }),

        notificationTitle: "Insurance Purchase",

        notificationMessage:
            `₦${amount} insurance purchase successful`,

        narration: "Insurance Purchase",

        revenue: {

            type: "insurance",

            amount,

            cost: amount,

            reference: null,

            user: userId,
        },
    });
};