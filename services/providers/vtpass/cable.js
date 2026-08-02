import { cableProviders } from "../../../config/cableConfig.js";
import vtpassClient from "./client.js";
import { getCablePlan } from "./getCablePlan.js";

export const buyCable = async ({
    providerId,
    smartCardNumber,
    // planId,
    reference,
    phoneNumber,
    variationCode
    // variation_code,
}) => {
    try {
        const serviceID = cableProviders[providerId];
        // const plan = cablePlans[planId];

        const plan = await getCablePlan(
            providerId,
            variationCode
        );

        if (!serviceID) {
            throw new Error("Invalid cable provider");
        }

        // if (!plan) {
        //     throw new Error("Invalid cable plan");
        // }

        const payload = {
            request_id: reference,
            serviceID,
            billersCode: smartCardNumber,
            variation_code: plan.variation_code,
            phone: phoneNumber,
            subscription_type: "change",
            amount: Number(plan.variation_amount),
        };

        // const payload = {
        //     request_id: reference,
        //     serviceID,
        //     billersCode: smartCardNumber,
        //     variation_code: plan.variationCode,
        //     phone: phoneNumber,
        //     subscription_type: "renew",
        //     amount: plan.amount,
        // };

        console.log("PAYLOAD");
        console.dir(payload, { depth: null });
        // console.log({
        //     baseURL: vtpassClient.defaults.baseURL,
        //     headers: vtpassClient.defaults.headers,
        // });

        console.time("VTpass Purchase");

        const { data } = await vtpassClient.post(
            "/pay",
            payload
        );

        console.timeEnd("VTpass Purchase");

        return data;
        // throw new Error("VTpass Cable provider not implemented yet.");
    } catch (error) {
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("HEADERS:", error.response?.headers);
        throw error;
    }

};

export const verifySmartCard = async ({ providerId, smartCardNumber }) => {
    const serviceID = cableProviders[providerId];

    if (!serviceID) {
        throw new Error("Invalid cable provider");
    }

    const { data } = await vtpassClient.post("/merchant-verify", {
        billersCode: smartCardNumber,
        serviceID,
    });

    return data;
};

// export const getCablePlans = async () => {
//     throw new Error("VTpass Cable plans not implemented yet.");
// };
// import { cableProviders } from "../../../config/cableConfig.js";
// import vtpassClient from "../vtpass/client.js";

export const getCablePlans = async (providerId) => {
    const serviceID = cableProviders[providerId];
    // console.log(serviceID, "serviceId");


    const { data } = await vtpassClient.get(
        `/service-variations?serviceID=${serviceID}`
    );
    // console.log(JSON.stringify(data, null, 2), "reergreg");
    console.log("providerId:", providerId);
    console.log("serviceID:", serviceID);

    return data.content.variations.map(plan => ({
        code: plan.variation_code,
        name: plan.name,
        amount: Number(plan.variation_amount),
    }));
};
