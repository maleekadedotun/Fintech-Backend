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
    try {
        const serviceID = electricityProviders[disco] || (typeof disco === "string" ? disco.toLowerCase().trim() : null);

        if (!serviceID) {
            throw new Error("Invalid electricity provider (disco)");
        }

        const payload = {
            request_id: reference,
            serviceID,
            billersCode: meterNumber,
            variation_code: meterType || "prepaid",
            amount: Number(amount),
            phone: phoneNumber,
        };
        console.log("ELECTRICITY PURCHASE PAYLOAD:");
        console.dir(payload, { depth: null });

        const { data } = await vtpassClient.post(
            "/pay",
            payload
        );

        return data;
    } catch (error) {
        console.log("ELECTRICITY PURCHASE ERROR STATUS:", error.response?.status);
        console.log("ELECTRICITY PURCHASE ERROR DATA:", error.response?.data);
        throw error;
    }
};

export const verifyMeter = async ({
    disco,
    meterNumber,
    meterType,
}) => {
    const serviceID = electricityProviders[disco] || (typeof disco === "string" ? disco.toLowerCase().trim() : null);

    if (!serviceID) {
        throw new Error("Invalid electricity provider (disco)");
    }

    const payload = {
        billersCode: meterNumber,
        serviceID,
        type: meterType || "prepaid",
    };

    console.log("ELECTRICITY VERIFY PAYLOAD:", payload);

    const { data } = await vtpassClient.post(
        "/merchant-verify",
        payload
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