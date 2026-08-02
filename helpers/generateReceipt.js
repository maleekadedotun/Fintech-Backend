// export const generateReceipt = ({
//     transaction,
//     wallet,
// }) => ({
//     receiptNumber: transaction.reference,

//     reference: transaction.reference,

//     date: transaction.createdAt,

//     status: transaction.status,

//     paymentType: transaction.category,

//     provider: transaction.metadata?.provider || "Internal",

//     recipient:
//         transaction.metadata?.receiverName ||
//         transaction.metadata?.senderName,

//     recipientAccount:
//         transaction.metadata?.receiverAccountNumber ||
//         transaction.metadata?.senderAccountNumber,

//     amount: transaction.amount,

//     charges:
//         transaction.metadata?.charges ?? 0,

//     walletBalance: wallet.balance,

//     accountNumber: wallet.accountNumber,

//     currency: wallet.currency,

//     narration:
//         transaction.metadata?.narration,
// });


// export const generateReceipt = ({
//     transaction,
//     wallet,
// }) => ({
//     receiptNumber: transaction.reference,
//     reference: transaction.reference,
//     date: transaction.createdAt,

//     status: transaction.status,
//     paymentType: transaction.category,

//     provider: transaction.metadata?.provider || "Internal",

//     senderName: transaction.metadata?.senderName,
//     senderAccount: transaction.metadata?.senderAccountNumber,

//     recipient: transaction.metadata?.receiverName,
//     recipientAccount: transaction.metadata?.receiverAccountNumber,

//     amount: transaction.amount,
//     charges: transaction.metadata?.charges ?? 0,

//     walletBalance: wallet.balance,
//     accountNumber: wallet.accountNumber,
//     currency: wallet.currency,

//     narration: transaction.metadata?.narration,
// });


export const generateReceipt = ({ transaction, wallet }) => ({
    receiptNumber: transaction.reference,
    reference: transaction.reference,
    date: transaction.createdAt,

    status: transaction.status,
    paymentType: transaction.category,
    provider: transaction.metadata?.provider || "Internal",

    senderName: transaction.metadata?.senderName,
    senderAccount: transaction.metadata?.senderAccountNumber,

    receiverName: transaction.metadata?.receiverName,
    receiverAccount: transaction.metadata?.receiverAccountNumber,

    amount: transaction.amount,
    charges: transaction.metadata?.charges ?? 0,

    walletBalance: wallet.balance,
    accountNumber: wallet.accountNumber,
    currency: wallet.currency,

    narration: transaction.metadata?.narration,
});