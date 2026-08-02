import { bettingProviders } from "../../../config/bettingProviders.js";
import vtpassClient from "./client.js";

export const purchaseBetting = async ({
    providerId,
    customerId,
    amount,
    phoneNumber,
    reference,
}) => {

    const provider = bettingProviders[providerId];

    if (!provider) {
        throw new Error("Invalid betting provider");
    }

    const serviceID = provider.serviceID;

    const payload = {
        request_id: reference,
        serviceID,
        billersCode: customerId,
        amount,
        phone: phoneNumber,
    };

    console.log("PAYLOAD betting-purchase");
    console.dir(payload, { depth: null });

    const { data } = await vtpassClient.post(
        "/pay",
        payload
    );

    return data;
};