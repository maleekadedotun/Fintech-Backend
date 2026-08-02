import { insuranceProviders } from "../../../config/insuranceProviders.js";
import vtpassClient from "./client.js";

export const purchaseInsurance = async ({
    providerId,
    billersCode,
    variationCode,
    amount,
    phoneNumber,
    reference,

    insuredName,
    email,
    plateNumber,
    chassisNumber,
    engineCapacity,
    vehicleMake,
    vehicleModel,
    vehicleColor,
    yearOfMake,
    state,
    lga,
}) => {

    const provider = insuranceProviders[providerId];

    if (!provider) {
        throw new Error("Invalid insurance provider");
    }

    const payload = {

        request_id: reference,

        serviceID: provider.serviceID,

        billersCode,

        variation_code: variationCode,

        amount,

        phone: phoneNumber,

        Insured_Name: insuredName,

        email,

        Plate_Number: plateNumber,

        Chasis_Number: chassisNumber,

        engine_capacity: engineCapacity,

        vehicle_make: vehicleMake,

        vehicle_model: vehicleModel,

        vehicle_color: vehicleColor,

        YearofMake: yearOfMake,

        state,

        lga,
    };

    console.log("INSURANCE PAYLOAD");
    console.dir(payload, { depth: null });

    const { data } = await vtpassClient.post(
        "/pay",
        payload
    );

    return data;
};



export const getInsurancePlans = async (providerId) => {

    const provider = insuranceProviders[providerId];

    if (!provider) {
        throw new Error("Invalid insurance provider");
    }

    const serviceID = provider.serviceID;

    const { data } = await vtpassClient.get(
        `/service-variations?serviceID=${serviceID}`
    );

    if (data.response_description !== "000") {
        throw new Error(
            data.content?.errors ||
            data.response_description ||
            "Unable to fetch insurance plans"
        );
    }

    return data.content.variations.map(plan => ({
        code: plan.variation_code,
        name: plan.name,
        amount: Number(plan.variation_amount),
    }));
};