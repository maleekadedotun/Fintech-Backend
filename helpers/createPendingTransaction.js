import Transaction from "../models/Transaction/Transaction.js";
import crypto from "crypto";
import { debitWallet } from "../services/wallet/walletService.js";

const generateRef = () => crypto.randomBytes(10).toString("hex");






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