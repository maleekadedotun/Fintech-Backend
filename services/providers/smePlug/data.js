import vtpassClient from "../vtpass/client.js";
import smePlugClient from "./client.js";

// import client from "./client.js";


// export const getDataPlans = async () => {
//     try {
//         const { data } = await smePlugClient.get("/data/plans");

//         return data;
//     } catch (error) {
//         throw new Error(
//             error.response?.data?.message ||
//             "Unable to fetch data plans"
//         );
//     }
// };
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

export const testVTpass = async () => {
    const { data } = await vtpassClient.get(
        // gotv, dstv, startimes
        "/service-variations?serviceID=gotv"
    );

    console.log(data);

    return data;
};

export const tesTvPasstPost = async () => {
    try {
        const { data } = await vtpassClient.post("/merchant-verify", {});
        console.log(data);
    } catch (err) {
        console.log(err.response?.status);
        console.log(err.response?.data);
    }
}


export const testVTpassInternet = async () => {
    const { data } = await vtpassClient.get(
        "/service-variations?serviceID=spectranet"
    );

    console.log(data);

    return data;
};

export const testVTpassInternetSmile = async () => {
    const { data } = await vtpassClient.get(
        "/service-variations?serviceID=smile-direct"
    );

    console.log(data);

    return data;
};

export const testVTpassEducation = async () => {
    const { data } = await vtpassClient.get(
        "/service-variations?serviceID=jamb"
    );

    console.log(data);

    return data;
};

    export const testVTpassBetting = async () => {
        const { data } = await vtpassClient.get(
            // "/services?identifier=payment"
            "/service-variations?serviceID=sportybet"
        );

        console.log(data);

        return data;
    };

    export const getServices = async () => {
    try {
        const { data } = await vtpassClient.get("/services");

        console.log(data);

        return data;
    } catch (error) {
        console.log(
            error.response?.data || error.message
        );
    }
};

export const testVTpassInsurance = async () => {
    const { data } = await vtpassClient.get(
        // "/services?identifier=insurance"  
        "/service-variations?serviceID=ui-insure"
    );

    console.log(data);

    return data;
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