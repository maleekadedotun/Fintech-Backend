import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { approveWithdrawalCtrl, withdrawCtrl } from "../../controllers/withdrawal/withdrawalCtrl.js";
import isAdmin from "../../middleware/isAdmin.js";

const withdrawalRoutes = express.Router();

withdrawalRoutes.post("/customers-withdrawal", isLoggedIn, withdrawCtrl);
withdrawalRoutes.put("/admin/withdrawals/:withdrawalId/approve", isLoggedIn, isAdmin, approveWithdrawalCtrl);

export default withdrawalRoutes;