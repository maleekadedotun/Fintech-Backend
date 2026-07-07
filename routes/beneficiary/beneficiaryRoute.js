import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";

import { addBeneficiaryCtrl, deleteBeneficiaryCtrl, getBeneficiariesCtrl } from "../../controllers/beneficiary/beneficiaryCtrl.js";

const beneficiaryRouter = express.Router();

beneficiaryRouter.post("/save-beneficiary", isLoggedIn, addBeneficiaryCtrl);
beneficiaryRouter.get("/", isLoggedIn, getBeneficiariesCtrl);
beneficiaryRouter.delete("/delete/:id", isLoggedIn, deleteBeneficiaryCtrl);

export default beneficiaryRouter;