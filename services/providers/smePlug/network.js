// import client from "./client.js";

// export const getNetworks = async () => {
//     try {
//         const { data } = await client.get("/network");

//         return data;
//     } catch (error) {
//         throw new Error(
//             error.response?.data?.message ||
//             "Unable to fetch networks"
//         );
//     }
// };

import client from "./client.js";

export const getNetworks = async () => {
    try {
        const { data } = await client.get("/networks");

        return data;
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Message:", error.message);

        throw new Error(
            error.response?.data?.message ||
            error.message
        );
    }
};