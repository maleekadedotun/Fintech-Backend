import executeBillPayment from "../../helpers/executeBillPayment.js";
import providerFactory from "../providers/factory/providerFactory.js";
import { getEducationPlans } from "../providers/vtpass/education.js";

export const educationService = async ({
    userId,
    disco,
    // serviceId,
    billersCode,
    variationCode,
    phoneNumber,
    // amounts
    pin,
}) => {

    const provider = providerFactory("education");
    console.log(provider, "service");



    const plans = await provider.getEducationPlans(disco);

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
        throw new Error("Invalid education plan");
    }

    const amount = plan.amount;
    console.log(amount, "service");


    return await executeBillPayment({
        userId,
        pin,
        amount,

        category: "education",

        // metadata: {
        //     disco,
        //     variationCode,
        //     phoneNumber,
        // },
        metadata: {
            disco,
            variationCode,
            billersCode,
            phoneNumber,
        },

        // providerAction: ({ reference, user }) =>
        //     provider.purchaseEducation({
        //         disco,
        //         // serviceId,
        //         billersCode,
        //         variationCode,
        //         phoneNumber: user.phoneNumber,
        //         amount,
        //         reference,
        //     }),

        providerAction: ({ reference, user }) => {
            console.log("providerAction called");

            return provider.purchaseEducation({
                disco,
                billersCode,
                variationCode,
                phoneNumber: user.phoneNumber,
                amount,
                reference,
            });
        },

        notificationTitle: "Education Purchase",

        notificationMessage: `₦${amount} education Purchase successful`,

        narration: "Education Purchase",

        revenue: {
            type: "education",
            amount,
            cost: amount,
            reference: null,
            user: userId,
        },
    });
};