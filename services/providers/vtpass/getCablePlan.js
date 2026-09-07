import { cableProviders } from "../../../config/cableConfig.js";
import vtpassClient from "./client.js";

export const getCablePlan = async (providerId, variationCode) => {
    const serviceID = cableProviders[providerId] || (typeof providerId === "string" ? providerId.toLowerCase() : null);

    if (!serviceID) {
        throw new Error("Invalid cable provider");
    }

    if (!variationCode) {
        throw new Error("Cable plan variation code is required");
    }

    const { data } = await vtpassClient.get(
        `/service-variations?serviceID=${serviceID}`
    );
    console.log(data, "Data");

    const variations = data?.content?.variations || [];
    const plan = variations.find(
        (item) =>
            item.variation_code === variationCode ||
            item.variation_code?.toLowerCase() === String(variationCode).toLowerCase().trim()
    );

    if (!plan) {
        throw new Error("Cable plan not found");
    }

    return plan;
};