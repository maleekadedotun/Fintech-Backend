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

// const validateProviderResponse = async ({
//     response,
//     transaction,
//     sender,
//     session,
//     defaultMessage = "Provider request failed",
// }) => {

//     // SMEPlug success
//     const smePlugSuccess =
//         response?.status === true &&
//         (
//             !response?.data?.current_status ||
//             response?.data?.current_status === "successful"
//         );

//     // VTpass success
//     const vtpassSuccess =
//         response?.code === "000" &&
//         (
//             response?.response_description === "TRANSACTION SUCCESSFUL" ||
//             response?.content?.transactions?.status === "delivered"
//         );

//     if (smePlugSuccess || vtpassSuccess) {
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
//             response?.message ||
//             response?.response_description ||
//             defaultMessage,
//         provider: response,
//     };
// };

// export default validateProviderResponse;


// const validateProviderResponse = async ({
//     response,
//     transaction,
//     sender,
//     session,
//     defaultMessage,
// }) => {

//     const isSuccessful =
//         response?.status === true &&
//         response?.data?.current_status === "successful";

//     if (!isSuccessful) {

//         transaction.status = "failed";

//         await transaction.save({ session });

//         const error = new Error(
//             response?.data?.msg || defaultMessage
//         );

//         error.statusCode = 400;
//         error.provider = response;

//         throw error;
//     }

//     return true;
// };

const validateProviderResponse = async ({
    response,
    transaction,
    sender,
    session,
    defaultMessage,
}) => {

    console.log("======== VALIDATING PROVIDER RESPONSE ========");

    console.dir(response, { depth: null });

    console.log("==============================================");

    /*
    ==========================================
    FORMAT 1

    Example:
    {
        status: true,
        data: {
            current_status: "successful"
        }
    }
    ==========================================
    */

    const smePlugSuccess =
        response?.status === true &&
        response?.data?.current_status === "successful";


    /*
    ==========================================
    FORMAT 2

    Example:
    {
        code: "000",
        content: {
            transactions: {
                status: "delivered"
            }
        },
        response_description: "TRANSACTION SUCCESSFUL"
    }
    ==========================================
    */

    const vtpassSuccess =
        response?.code === "000" &&
        response?.content?.transactions?.status === "delivered";


    /*
    ==========================================
    FINAL RESULT
    ==========================================
    */

    const isSuccessful =
        smePlugSuccess || vtpassSuccess;


    /*
    ==========================================
    HANDLE FAILURE
    ==========================================
    */

    if (!isSuccessful) {

        transaction.status = "failed";

        await transaction.save({ session });

        const errorMessage =
            response?.data?.msg ||
            response?.response_description ||
            defaultMessage;

        const error = new Error(errorMessage);

        error.statusCode = 400;

        error.provider = response;

        throw error;
    }


    return true;
};
export default validateProviderResponse;