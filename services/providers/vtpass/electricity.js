// export const purchaseElectricity = async ({
//     disco,
//     meterNumber,
//     meterType,
//     amount,
//     phoneNumber,
//     reference,
// }) => {

import { electricityProviders } from "../../../config/electricityProviders.js";
import vtpassClient from "./client.js";

//     throw new Error("VTpass Electricity provider not implemented yet.");

// };

export const purchaseElectricity = async ({
    disco,
    meterNumber,
    meterType,
    amount,
    phoneNumber,
    reference,
}) => {

    const serviceID = electricityProviders[disco];

    const payload = {
        request_id: reference,
        serviceID,
        billersCode: meterNumber,
        variation_code: meterType,
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

export const verifyMeter = async ({
    disco,
    meterNumber,
    meterType,
}) => {

    const serviceID = electricityProviders[disco];
    console.log({
    serviceID,
    billersCode: meterNumber,
    type: meterType,
});

    const { data } = await vtpassClient.post(
        "/merchant-verify",
        {
            billersCode: meterNumber,
            serviceID,
        }
    );

    return data;
};

// export const verifyMeter = async ({
//     disco,
//     meterNumber,
//     meterType,
// }) => {

//     throw new Error("Meter verification not implemented yet.");

// };