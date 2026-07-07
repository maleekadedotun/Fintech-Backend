// import crypto from "crypto";


// export const buyDataBundle = async () => {
//     return {
//         success: true,
//         providerReference: crypto.randomUUID(),
//     };
//     // return res.json({
//     //     status: "success",
//     // })
// };

import crypto from "crypto";

export const buyDataBundle = async ({
    phoneNumber,
    network,
    planId,
}) => {

    // simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        success: true,
        providerReference: crypto.randomBytes(8).toString("hex"),
        phoneNumber,
        network,
        planId,
    };
};