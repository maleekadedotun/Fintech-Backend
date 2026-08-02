import executeBillPayment from "../../helpers/executeBillPayment.js";
import providerFactory from "../providers/factory/providerFactory.js";

export const buyElectricityService = async ({
    disco,
    meterNumber,
    meterType,
    amount,
    phoneNumber,
    pin,
    userId,
}) => {

    const provider = providerFactory("electricity");

    return executeBillPayment({
        userId,
        pin,
        amount,
        category: "electricity",

        providerAction: ({ reference, user }) =>
            provider.purchaseElectricity({
                disco,
                meterNumber,
                meterType,
                amount,
                phoneNumber: user.phoneNumber,
                reference,
            }),
    });
};