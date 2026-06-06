import express from "express";

import isLoggedIn from "../../middleware/isLogIn.js";
import { creditWalletCtrl, getTransactionsCtrl, getWalletCtrl, transferFundsCtrl } from "../../controllers/transaction/transaction.js";

const walletRouter = express.Router();
walletRouter.get("/", isLoggedIn, getWalletCtrl);
walletRouter.get("/transactions", isLoggedIn, getTransactionsCtrl);
walletRouter.post("/transfer", isLoggedIn, transferFundsCtrl);

walletRouter.post("/credit", isLoggedIn, creditWalletCtrl);


export default walletRouter;
