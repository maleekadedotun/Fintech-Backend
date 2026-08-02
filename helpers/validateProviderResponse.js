// import failTransaction from "./failTransacton.js";

// const validateProviderResponse = async ({
//     response,
//     transaction,
//     sender,
//     session,
//     defaultMessage = "Provider request failed",
// }) => {

//     // if (
//     //     response?.status &&
//     //     response?.data?.current_status === "successful"
//     // ) {
//     //     return;
//     // }

//     const success =
//         response?.status === true &&
//         (
//             !response?.data?.current_status ||
//             response.data.current_status === "successful"
//         );

//     if (success) {
//         return response;
//     }
//     await failTransaction({
//         transaction,
//         sender,
//         session,
//     });

//     throw {
//         statusCode: 400,
//         message:
//             response?.msg ||
//             response?.data?.msg ||
//             defaultMessage,
//         provider: response,
//     };
// };

// export default validateProviderResponse;
import failTransaction from "./failTransacton.js";

const validateProviderResponse = async ({
    response,
    transaction,
    sender,
    session,
    defaultMessage = "Provider request failed",
}) => {

    // SMEPlug success
    const smePlugSuccess =
        response?.status === true &&
        (
            !response?.data?.current_status ||
            response?.data?.current_status === "successful"
        );

    // VTpass success
    const vtpassSuccess =
        response?.code === "000" &&
        (
            response?.response_description === "TRANSACTION SUCCESSFUL" ||
            response?.content?.transactions?.status === "delivered"
        );

    if (smePlugSuccess || vtpassSuccess) {
        return response;
    }

    await failTransaction({
        transaction,
        sender,
        session,
    });

    throw {
        statusCode: 400,
        message:
            response?.msg ||
            response?.message ||
            response?.response_description ||
            defaultMessage,
        provider: response,
    };
};

export default validateProviderResponse;