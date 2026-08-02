import express from "express";

import isLoggedIn from "../../middleware/isLogIn.js";
import {
    creditWalletCtrl, getAllWalletCtrl, getTransactionsCtrl,
    getVirtualAccountCtrl, getWalletAnalyticsCtrl, getWalletCtrl,
    lookupAccountCtrl, transferFundsCtrl, simulateBankTransferCtrl, getSingleTransactionCtrl,
    getAllTransactionsCtrl
} from "../../controllers/transaction/transaction.js";
import { getReceiptCtrl } from "../../controllers/receipt/receiptCtrl.js";

const walletRouter = express.Router();
walletRouter.get("/", getAllWalletCtrl);
walletRouter.get("/balance", isLoggedIn, getWalletCtrl);
walletRouter.get("/transactions", isLoggedIn, getTransactionsCtrl);
walletRouter.get("/transactions/all", getAllTransactionsCtrl);
walletRouter.get("/transaction/:id", isLoggedIn, getSingleTransactionCtrl);
walletRouter.post("/transfer", isLoggedIn, transferFundsCtrl);
walletRouter.post("/simulate-bank-transfer", simulateBankTransferCtrl);

// Receipt route
walletRouter.get("/transactions/:transactionId/receipt", isLoggedIn, getReceiptCtrl);

walletRouter.post("/credit", isLoggedIn, creditWalletCtrl);
walletRouter.get("/lookup/:accountNumber", isLoggedIn, lookupAccountCtrl);
walletRouter.get("/analytics", isLoggedIn, getWalletAnalyticsCtrl);
walletRouter.get("/virtual-account", isLoggedIn, getVirtualAccountCtrl);

export default walletRouter;