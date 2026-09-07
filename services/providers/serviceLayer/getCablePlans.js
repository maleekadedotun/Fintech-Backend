import { cableProviders } from "../../../config/cableConfig.js";
import vtpassClient from "../vtpass/client.js";

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
