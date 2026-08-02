// export default async function successTransaction({
//     transaction,
//     response,
//     session,
// }) {
//     transaction.status = "success";

//     transaction.metadata.providerReference =
//         response.data.reference;

//     transaction.metadata.providerStatus =
//         response.data.current_status;

//     await transaction.save({ session });

//     return transaction;
// }

export default async function successTransaction({
    transaction,
    response,
    session,
}) {
    transaction.status = "success";

    transaction.metadata.providerReference =
        response.requestId;

    transaction.metadata.providerTransactionId =
        response.content?.transactions?.transactionId;

    transaction.metadata.providerStatus =
        response.content?.transactions?.status;

    await transaction.save({ session });

    return transaction;
}