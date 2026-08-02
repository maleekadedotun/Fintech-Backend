// import executeBillPayment from "../../helpers/executeBillPayment.js";
// import providerFactory from "../providers/factory/providerFactory.js";
// import crypto from "crypto";


// const generateRef = () => crypto.randomBytes(10).toString("hex");

// export const cableService = async ({
//     userId,
//     pin,
//     amount,
//     providerId,
//     smartCardNumber,
//     planId,
// }) => {

//     await verifyTransactionPin(userId, pin);

//     const provider = providerFactory();
//     const reference = generateRef();

//     return executeBillPayment({
//         userId,
//         pin,
//         amount,
//         category: "cable",
//         metadata: {
//             providerId,
//             smartCardNumber,
//             planId,
//         },
//         providerAction: (reference) =>
//             provider.buyCable({
//                 providerId,
//                 smartCardNumber,
//                 planId,
//                 reference,
//             }),
//         notificationTitle: "Cable Subscription",
//         notificationMessage: `Cable subscription successful`,
//         narration: "Cable subscription",
//         revenue: {
//             type: "cable",
//             amount,
//             cost: amount,
//             reference,
//             user: userId,
//         },
//     });
// }


// import { cablePlans } from "../../config/cableConfig.js";
import executeBillPayment from "../../helpers/executeBillPayment.js";
import providerFactory from "../providers/factory/providerFactory.js";
import { getCablePlan } from "../providers/vtpass/getCablePlan.js";
// import { getCablePlan } from "../providers/vtpass/getCablePlan.js";
// import { getCablePlan } from "../providers/vtPass/cable.js";


export const buyCableService = async ({
    userId,
    providerId,
    smartCardNumber,
    planId,
    pin,
    phoneNumber,
    variationCode
}) => {

    console.log("providerId:", providerId);
    console.log("variationCode:", variationCode);
    const provider = providerFactory("cable");

    // const plan = cablePlans[planId];
    const plan = await getCablePlan(
        providerId,
        variationCode
    );

    const amount = Number(plan.variation_amount);

    if (!plan) {
        throw new Error("Invalid cable plan");
    }

    // const amount = plan.amount;

    console.log("Cable amount:", amount);

    return executeBillPayment({
        userId,
        pin,
        amount,
        phoneNumber,
        category: "cable",
        metadata: {
            providerId,
            smartCardNumber,
            planId,
        },
        providerAction: ({ reference, user, }) =>
            provider.purchaseCable({
                providerId,
                smartCardNumber,
                variationCode,
                amount,
                reference,
                phoneNumber: user.phoneNumber,
            }),
        notificationTitle: "Cable Subscription",
        notificationMessage: `₦${amount} cable subscription successful`,
        narration: "Cable Subscription",
        revenue: {
            type: "cable",
            amount,
            cost: amount,
            reference: null,
            user: userId,
        },
    });
};

// export const buyCableService = async ({
//     userId,
//     providerId,
//     smartCardNumber,
//     planId,
//     amount,
//     pin,
// }) => {


//     const provider = await providerFactory("cable");
//      const plan = cablePlans[planId];
//     console.log(provider);
//     console.log(Object.keys(provider));

//     return await executeBillPayment({

//         userId,

//         pin,

//         amount: Number(amount),

//         category: "cable",

//         metadata: {
//             providerId,
//             smartCardNumber,
//             planId,
//         },

//         providerAction: (reference) =>
//             provider.purchaseCable({
//                 providerId,
//                 smartCardNumber,
//                 planId,
//                 reference,
//             }),

//         notificationTitle: "Cable Subscription",

//         notificationMessage: `₦${amount} cable subscription successful`,

//         narration: "Cable Subscription",

//         revenue: {
//             type: "cable",
//             amount: Number(amount),
//             cost: Number(amount),
//             reference: null,
//             user: userId,
//         },
//     });

// };