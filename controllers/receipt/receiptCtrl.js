import { generateReceipt } from "../../helpers/generateReceipt.js";
import Transaction from "../../models/Transaction/Transaction.js";
import Wallet from "../../models/Wallet/Wallet.js";

export const getReceiptCtrl = async (
    req,
    res
) => {
    // console.log("req.params.id:", req.params.id);
    // console.log(
    //     "transactionId:",
    //     req.params.transactionId
    // );

    const transaction = await Transaction.findById(req.params.transactionId);
    // console.log("transaction:", transaction);

    if (!transaction) {

        return res.status(404).json({

            success: false,

            message: "Transaction not found"

        });

    }

    const wallet = await Wallet.findOne({
        user: transaction.user
    });
    // console.log("transaction:", transaction);
    // console.log("wallet:", wallet);

    // console.log("TRANSACTION");
    // console.dir(transaction, { depth: null });

    // console.log("METADATA");
    // console.dir(transaction.metadata, { depth: null });
    console.log("Transaction Type:", transaction.type);
console.log("Transaction Metadata:", transaction.metadata);
    console.log("========== METADATA ==========");
console.dir(transaction.metadata, { depth: null });

    const receipt = generateReceipt(
        {
            transaction,
            wallet
        }
    );
    console.log(transaction.metadata, "metadata");
    console.log("receipt:", receipt);

    res.json({
        success: true,
        receipt
    });

};