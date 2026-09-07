

import { internetProviders } from "../../../config/internetConfig.js";
import vtpassClient from "./client.js";


export const purchaseInternet = async ({
    disco,
    // meterNumber,
    serviceId,
    billersCode,
    amount,
    variationCode,
    phoneNumber,
    reference,
}) => {
    console.log("disco =", disco);

    // Look up by serviceID string (e.g. "spectranet", "smile-direct")
    const provider = internetProviders.find(
        (p) => p.serviceID === disco || p.serviceID === disco + "-direct"
    );

    if (!provider) {
        throw new Error(`Invalid internet provider: ${disco}`);
    }

    const serviceID = provider.serviceID;

    const payload = {
        request_id: reference,
        serviceID,
        billersCode,
        variation_code: variationCode,
        amount,
        phone: phoneNumber,
    };
    console.log("PAYLOAD");
    console.dir(payload, { depth: null });

    const { data } = await vtpassClient.post(
        "/pay",
        payload
    );

    return data;
};

export const verifyInternet = async ({
    disco,
    // serviceID,
    billersCode,
}) => {
    console.log("disco =", disco);

    // Look up by serviceID string (e.g. "spectranet", "smile-direct")
    const provider = internetProviders.find(
        (p) => p.serviceID === disco || p.serviceID === disco + "-direct"
    );

    if (!provider) {
        throw new Error(`Invalid internet provider: ${disco}`);
    }

    const serviceID = provider.serviceID;

    console.log({
        serviceID,
        billersCode,
    });

    const { data } = await vtpassClient.post(
        "/merchant-verify",
        {
            disco,
            serviceID,
            billersCode,
        }
    );
    console.log(JSON.stringify(data, null, 2), "dataInternet-verify");



    return data;
};


// vtpass/cable.js

export const getInternetPlans = async (providerId) => {
    console.log(providerId, 'Internet');
    

    // const serviceID = internetProviders[providerId];
    // Look up by serviceID string (e.g. "spectranet", "smile-direct")
    const provider = internetProviders.find(
        (p) => p.serviceID === providerId || p.serviceID === providerId + "-direct"
    );

    if (!provider) {
        throw new Error(`Invalid internet provider: ${providerId}`);
    }

    const serviceID = provider.serviceID;

    // console.log("serviceID:", serviceID);

    const { data } = await vtpassClient.get(
        `/service-variations?serviceID=${serviceID}`
    );
    // console.log(JSON.stringify(data, null, 2), "dataInternet");

    return data.content.variations.map(plan => ({
        code: plan.variation_code,
        name: plan.name,
        amount: Number(plan.variation_amount),
    }));
};