

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
    console.log("typeof disco =", typeof disco);

    // const serviceID = internetProviders[disco];
    const provider = internetProviders[Number(disco) - 1];

    if (!provider) {
        throw new Error("Invalid internet provider");
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
    const provider = internetProviders[Number(disco) - 1];

    console.log("disco =", disco);
    console.log("typeof disco =", typeof disco);
    console.log("internetProviders =", internetProviders);

    if (!provider) {
        throw new Error("Invalid internet provider");
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
    const provider = internetProviders[Number(providerId) - 1];

    // console.log("Provider:", provider);

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