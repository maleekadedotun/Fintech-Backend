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
        amount: Number(amount),
        category: "electricity",
        metadata: {
            disco,
            meterNumber,
            meterType,
            phoneNumber,
        },
        providerAction: ({ reference, user }) =>
            provider.purchaseElectricity({
                disco,
                meterNumber,
                meterType,
                amount: Number(amount),
                phoneNumber: phoneNumber || user?.phoneNumber,
                reference,
            }),
        notificationTitle: "Electricity Purchase",
        notificationMessage: `₦${amount} electricity payment for ${disco} (${meterNumber}) successful`,
        narration: `Electricity payment - ${disco}`,
        revenue: {
            type: "electricity",
            amount: Number(amount),
            cost: Number(amount),
            reference: null,
            user: userId,
        },
    });
};