import Transaction from "../models/Transaction/Transaction.js";
import crypto from "crypto";
import { debitWallet } from "../services/wallet/walletService.js";

const generateRef = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const randomHex = crypto.randomBytes(4).toString("hex");
    return `${dateStr}${randomHex}`;
};






const createPendingTransaction = async ({
    userId,
    amount,
    category,
    metadata = {},
    session,
}) => {
    console.log("createPendingTransaction amount:", amount);
    console.log("type:", typeof amount);

    // Debit wallet
    const sender = await debitWallet({
        userId,
        amount,
        session,
    });

    const reference = generateRef();

    const [transaction] = await Transaction.create(
        [
            {
                user: userId,

                type: "debit",

                category,

                amount,

                reference,

                status: "pending",

                metadata,
            },
        ],
        { session }
    );

    return {
        sender,
        transaction,
        reference,
    };
};

export default createPendingTransaction;
// const createPendingTransaction = async ({
//     userId,
//     amount,
//     category,
//     metadata,
//     session,
// }) => {

//     // Debit wallet
//     const sender = await debitWallet({
//         userId,
//         amount,
//         session,
//     });

//     // Generate reference
//     const reference = generateRef();

//     // Create pending transaction
//     const [transaction] = await Transaction.create(
//         [
//             {
//                 user: userId,
//                 type: "debit",
//                 category,
//                 amount,
//                 reference,
//                 status: "pending",
//                 metadata,
//             },
//         ],
//         { session }
//     );

//     return {
//         sender,
//         transaction,
//         reference,
//     };
// };

// export default createPendingTransaction;    