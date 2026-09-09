import express from "express";
import {
    submitKYCCtrl,
    verifyKYCCtrl,
    rejectKYCCtrl,
    getPendingKYCCtrl,
} from "../../controllers/kyc/kycCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";
import isAdmin from "../../middleware/isAdmin.js";

const kycRouter = express.Router();

// User: submit KYC for review
kycRouter.post("/kyc-submit", isLoggedIn, submitKYCCtrl);

// Admin: list all pending KYC submissions
kycRouter.get("/kyc-pending", isAdmin, getPendingKYCCtrl);

// Admin: approve a user's KYC
kycRouter.patch("/kyc-verify/:userId", isAdmin, verifyKYCCtrl);

// Admin: reject a user's KYC
kycRouter.patch("/kyc-reject/:userId", isAdmin, rejectKYCCtrl);

export default kycRouter;