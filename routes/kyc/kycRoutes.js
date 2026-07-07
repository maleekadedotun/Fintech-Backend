import express from "express";
import { submitKYCCtrl, verifyKYCCtrl } from "../../controllers/kyc/kycCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";

const kycRouter = express.Router();

kycRouter.post("/kyc-submit", isLoggedIn, submitKYCCtrl);

kycRouter.patch("/kyc-verify/:userId", isLoggedIn, verifyKYCCtrl);

export default kycRouter;