import express from "express";

import isLoggedIn from "../../middleware/isLogIn.js";
import { creditWalletCtrl, getWalletCtrl, transferFundsCtrl } from "../../controllers/transaction/transaction.js";

const walleRouter = express.Router();

walleRouter.get("/:id", isLoggedIn, getWalletCtrl);
walleRouter.post("/credit/:id", isLoggedIn, creditWalletCtrl);
walleRouter.post("/transfer", isLoggedIn, transferFundsCtrl);


export default walleRouter;
