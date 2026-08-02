import { cableProviders } from "../../../config/cableConfig.js";
import vtpassClient from "../vtpass/client.js";

export const getCablePlans = async (providerId) => {
    const serviceID = cableProviders[providerId];
    console.log(serviceID, "serviceId");


    const { data } = await vtpassClient.get(
        `/service-variations?serviceID=${serviceID}`
    );
    console.log(JSON.stringify(data, null, 2), "reergreg");
    console.log("providerId:", providerId);
    console.log("serviceID:", serviceID);

    return data.content.variations.map(plan => ({
        code: plan.variation_code,
        name: plan.name,
        amount: Number(plan.variation_amount),
    }));
};
