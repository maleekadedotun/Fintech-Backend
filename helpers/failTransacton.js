import { creditWallet } from "../services/wallet/walletService.js";
import { emitWalletUpdate } from "../socket/socketEmitter.js";
import createNotification from "./createNotification.js";

// const failTransaction = async ({
//     transaction,
//     sender,
//     session,
// }) => {

//     transaction.status = "failed";

//     await transaction.save({ session });

//     // await creditWallet({
//     //     userId: transaction.user,
//     //     amount: transaction.amount,
//     //     session,
//     // });

//     // emitWalletUpdate(sender.wallet.user, {
//     //     balance: sender.balanceBefore,
//     //     accountNumber: sender.wallet.accountNumber,
//     // });

//     const refundedWallet = await creditWallet({
//         userId: transaction.user,
//         amount: transaction.amount,
//         session,
//     });

//     emitWalletUpdate(refundedWallet.wallet.user, {
//         balance: refundedWallet.balanceAfter,
//         accountNumber: refundedWallet.wallet.accountNumber,
//     });

//     await createNotification(
//         transaction.user,
//         "Transaction Failed",
//         `Your wallet has been refunded because the provider could not complete your ${transaction.category} purchase.`
//     );

//     return {
//         transaction,
//         wallet: refundedWallet.wallet,
//     };
// };

const failTransaction = async ({
    transaction,
    session,
}) => {

    transaction.status = "failed";

    await transaction.save({ session });

    return {
        transaction,
    };
};

export default failTransaction;