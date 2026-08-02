import { educationProviders } from "../../../config/educationConfig.js";
import vtpassClient from "./client.js";


export const purchaseEducation = async ({
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

    const provider = educationProviders[disco];
    // const provider = educationProviders[Number(disco) - 1];
    console.log("education provider", provider);


    if (!provider) {
        throw new Error("Invalid education provider");
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
    console.log("PAYLOAD education-purchase ");
    console.dir(payload, { depth: null });

    const { data } = await vtpassClient.post(
        "/pay",
        payload
    );

    return data;
};

export const getEducationPlans = async (providerId) => {
    console.log(providerId, "ProviderId");

    const provider = educationProviders[providerId];

    if (!provider) {
        throw new Error("Invalid education provider");
    }

    console.log("Provider:", provider);

    const serviceID = provider.serviceID;

    console.log("serviceID:", serviceID);

    const url = `/service-variations?serviceID=${serviceID}`;

    console.log("URL:", url);

    const { data } = await vtpassClient.get(url);

    console.log(JSON.stringify(data, null, 2), "dataEducation");

    if (data.response_description !== "000") {
        throw new Error(
            data.content?.errors ||
            data.response_description ||
            "Unable to fetch plans"
        );
    }

    return data.content.variations.map(plan => ({
        code: plan.variation_code,
        name: plan.name,
        amount: Number(plan.variation_amount),
    }));
};

// export const verifyInternet = async ({
//     disco,
//     // serviceID,
//     billersCode,
// }) => {
//     const provider = internetProviders[Number(disco) - 1];

//     console.log("disco =", disco);
//     console.log("typeof disco =", typeof disco);
//     console.log("internetProviders =", internetProviders);

//     if (!provider) {
//         throw new Error("Invalid internet provider");
//     }

//     const serviceID = provider.serviceID;

//     console.log({
//         serviceID,
//         billersCode,
//     });

//     const { data } = await vtpassClient.post(
//         "/merchant-verify",
//         {
//             disco,
//             serviceID,
//             billersCode,
//         }
//     );
//     console.log(JSON.stringify(data, null, 2), "dataInternet-verify");



//     return data;
// };


// vtpass/cable.js

// export const getEducationPlans = async (providerId) => {
//     console.log(providerId, "ProviderId");


//     const serviceID = educationProviders[providerId];
//     // const provider = educationProviders[Number(providerId) - 1];

//     console.log("Provider:", serviceID);

//     console.log("serviceID:", JSON.stringify(serviceID));
//     // const serviceID = provider.serviceID;

//     // console.log("serviceID:", serviceID);

//     console.log(
//         "URL:",
//         `/service-variations?serviceID=${serviceID}`
//     );

//     const { data } = await vtpassClient.get(
//         `/service-variations?serviceID=${serviceID}`
//     );
//     console.log(JSON.stringify(data, null, 2), "dataEducation");

//     if (data.response_description !== "000") {
//         throw new Error(
//             data.content?.errors ||
//             data.response_description ||
//             "Unable to fetch plans"
//         );
//     }

//     return data.content.variations.map(plan => ({
//         code: plan.variation_code,
//         name: plan.name,
//         amount: Number(plan.variation_amount),
//     }));
// };