import { cableProviders } from "../../../config/cableConfig.js";
import vtpassClient from "./client.js";

export const getCablePlan = async (providerId, variationCode) => {
    const serviceID = cableProviders[providerId];

    if (!serviceID) {
        throw new Error("Invalid cable provider");
    }

    const { data } = await vtpassClient.get(
        `/service-variations?serviceID=${serviceID}`
    );
    console.log(data, "Data");
    

    const plan = data.content.variations.find(
        (item) => item.variation_code === variationCode
    );

    if (!plan) {
        throw new Error("Cable plan not found");
    }

    return plan;
};