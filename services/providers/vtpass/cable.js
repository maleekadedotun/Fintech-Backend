import { cableProviders } from "../../../config/cableConfig.js";
import vtpassClient from "./client.js";
import { getCablePlan } from "./getCablePlan.js";

export const buyCable = async ({
    providerId,
    smartCardNumber,
    reference,
    phoneNumber,
    variationCode
}) => {
    try {
        const serviceID = cableProviders[providerId] || (typeof providerId === "string" ? providerId.toLowerCase() : null);

        if (!serviceID) {
            throw new Error("Invalid cable provider");
        }

        const plan = await getCablePlan(
            providerId,
            variationCode
        );

        const payload = {
            request_id: reference,
            serviceID,
            billersCode: smartCardNumber,
            variation_code: plan.variation_code,
            phone: phoneNumber,
            subscription_type: "change",
            amount: Number(plan.variation_amount),
        };

        console.log("PAYLOAD");
        console.dir(payload, { depth: null });

        console.time("VTpass Purchase");

        const { data } = await vtpassClient.post(
            "/pay",
            payload
        );

        console.timeEnd("VTpass Purchase");

        return data;
    } catch (error) {
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("HEADERS:", error.response?.headers);
        throw error;
    }
};

export const verifySmartCard = async ({ providerId, smartCardNumber }) => {
    const serviceID = cableProviders[providerId] || (typeof providerId === "string" ? providerId.toLowerCase() : null);

    if (!serviceID) {
        throw new Error("Invalid cable provider");
    }

    const { data } = await vtpassClient.post("/merchant-verify", {
        billersCode: smartCardNumber,
        serviceID,
    });

    return data;
};

export const getCablePlans = async (providerId) => {
    const serviceID = cableProviders[providerId] || (typeof providerId === "string" ? providerId.toLowerCase() : null);

    if (!serviceID) {
        throw new Error("Invalid cable provider");
    }

    const { data } = await vtpassClient.get(
        `/service-variations?serviceID=${serviceID}`
    );

    const variations = data?.content?.variations || [];

    return variations.map(plan => ({
        code: plan.variation_code,
        variation_code: plan.variation_code,
        variationCode: plan.variation_code,
        name: plan.name,
        amount: Number(plan.variation_amount),
        variation_amount: Number(plan.variation_amount),
    }));
};
