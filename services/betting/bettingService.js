import executeBillPayment from "../../helpers/executeBillPayment.js";
import providerFactory from "../providers/factory/providerFactory.js";

export const buyBettingService = async ({
    userId,
    providerId,
    customerId,
    amount,
    phoneNumber,
    pin,
}) => {
    const provider = providerFactory("betting");

    return await executeBillPayment({
        userId,
        pin,
        amount,

        category: "betting",

        metadata: {
            providerId,
            customerId,
            phoneNumber,
        },

        providerAction: ({ reference, user }) =>
            provider.purchaseBetting({
                providerId,
                customerId,
                amount,
                phoneNumber: user.phoneNumber,
                reference,
            }),

        notificationTitle: "Betting Wallet Funding",

        notificationMessage: `₦${amount} betting wallet funded successfully`,

        narration: "Betting Wallet Funding",

        revenue: {
            type: "betting",
            amount,
            cost: amount,
            reference: null,
            user: userId,
        },
    });
};