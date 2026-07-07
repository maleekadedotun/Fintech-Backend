import express from "express";
import { getLedgerCtrl } from "../../controllers/ledger/ledgerCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";

const ledgerRouter = express.Router();

ledgerRouter.get("/", isLoggedIn, getLedgerCtrl);
export default ledgerRouter;