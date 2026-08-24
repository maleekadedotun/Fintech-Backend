import smePlugClient from "./client.js";

// export const purchaseAirtime = async ({
//     networkId,
//     phone,
//     amount,
//     reference,
// }) => {
//     try {
//         const payload = {
//             network_id: networkId,
//             phone,
//             amount,
//             customer_reference: reference,
//         };

//         console.log(payload);

//         const { data } = await smePlugClient.post(
//             "/airtime/purchase",
//             payload
//         );

//         return data;
//     } catch (error) {
//         console.log("STATUS:", error.response?.status);
//         console.log("DATA:", error.response?.data);

//         throw error;
//     }
// };
// import smePlugClient from "../client.js";

export const purchaseAirtime = async ({
    networkId,
    phoneNumber,
    amount,
    reference,
}) => {
    try {
        const payload = {
            network_id: networkId,
            phone: phoneNumber,
            amount,
            customer_reference: reference,
        };

        console.log("Payload:", payload);

        const { data } = await smePlugClient.post(
            "/airtime/purchase",
            payload
        );

        return data;

    } catch (error) {

        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("MESSAGE:", error.message);
         throw {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.msg || error.message,
        provider: error.response?.data,
    };

        throw error;
    }
};


// Get network

export const getAirtimeNetworks = async () => {
    try {
        const { data } = await smePlugClient.get("/networks");
        console.log("Data", data);
        

        return data;

    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Unable to fetch airtime networks"
        );
    }
};