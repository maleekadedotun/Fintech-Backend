import executeBillPayment from "../../helpers/executeBillPayment.js";
import providerFactory from "../providers/factory/providerFactory.js";
import { getInternetPlans } from "../providers/vtpass/internet.js";
// import getInternetPlans from "../../services/providers/vtpass/";

export const buyInternetService = async ({
    userId,
    disco,
    // serviceId,
    billersCode,
    variationCode,
    phoneNumber,
    // amounts
    pin,
}) => {

    const provider = providerFactory("internet");


    const plans = await provider.getInternetPlans(disco);

    const plan = plans.find(
        p => p.code === variationCode
    );
    // const plan = await getInternetPlans(
    //     disco,
    //     variationCode
    // );
    console.log(plan, "Selected Plan");


    // const amount = plan.amount;

    if (!plan) {
        throw new Error("Invalid internet plan");
    }

    const amount = plan.amount;
    console.log(amount, "service");


    return await executeBillPayment({
        userId,
        pin,
        amount,

        category: "internet",

        metadata: {
            disco,
            variationCode,
            phoneNumber,
        },

        providerAction: ({ reference, user }) =>
            provider.purchaseInternet({
                disco,
                // serviceId,
                billersCode,
                variationCode,
                phoneNumber: user.phoneNumber,
                amount,
                reference,
            }),

        notificationTitle: "Internet Subscription",

        notificationMessage: `₦${amount} internet subscription successful`,

        narration: "Internet Subscription",

        revenue: {
            type: "internet",
            amount,
            cost: amount,
            reference: null,
            user: userId,
        },
    });
};