import axios from "axios";
import smePlugClient from "./client.js";

export const getCableProviders = async () => {

    // Call SMEPlug API

};

export const getCablePlans = async (
    providerId
) => {

    // Call SMEPlug API

};

export const verifySmartCard = async ({
    providerId,
    smartCardNumber,
}) => {

    // Call SMEPlug API

};

export const buyCable = async ({
    providerId,
    smartCardNumber,
    planId,
    reference,
}) => {

    const payload = {
        cable_id: providerId,
        smartcard_number: smartCardNumber,
        package_id: planId,
        customer_reference: reference,
    };

    console.log("Cable Payload:");
    console.log(payload);

    try {

        const { data } = await smePlugClient.post(
            "/cable/purchase",
            payload
        );

        return data;

    } catch (error) {
        console.log("URL:", error.config?.baseURL + error.config?.url);
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);

        throw error;

    }

};