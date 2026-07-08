import { smePlugClient } from "./client.js";

export const getDataPlans = async (networkId) => {
    try {
        const { data } = await smePlugClient.get(
            `/data/plans?network_id=${networkId}`
        );

        return data;
    } catch (error) {
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);

        throw error;
    }
};