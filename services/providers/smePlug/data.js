import smePlugClient from "./client.js";

// import client from "./client.js";


export const getDataPlans = async () => {
    try {
        const { data } = await smePlugClient.get("/data/plans");

        return data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Unable to fetch data plans"
        );
    }
};

export const purchaseData = async ({
    networkId,
    planId,
    phone,
    reference,
}) => {
    try {
        const payload = {
            network_id: networkId,
            plan_id: planId,
            phone,
            customer_reference: reference,
        };

        console.log(payload);

        const { data } = await smePlugClient.post(
            "/data/purchase",
            payload
        );

        return data;
    } catch (error) {
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        throw error;
    }
};


// export const purchaseData = async ({
//     networkId,
//     planId,
//     phone,
//     reference,
// }) => {
//     console.log({
//         networkId,
//         planId,
//         phone,
//         reference,
//     });

//     const payload = {
//         network_id: networkId,
//         plan_id: planId,
//         phone,
//         customer_reference: reference,
//     };

//     console.log(payload);

//     try {
//         const { data } = await smePlugClient.post(
//             "/data/purchase",
//             payload
//         );

//         return data;
//     } catch (error) {
//         console.log("STATUS:", error.response?.status);
//         console.log("DATA:", error.response?.data);
//         throw error;
//     }
// };