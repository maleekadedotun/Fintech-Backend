import express from "express";
import { resetTransactionPinCtrl, sendPinResetOtpCtrl, setTransactionPinCtrl } from "../../controllers/pin/pinCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";

const pinRoutes = express.Router();

pinRoutes.post("/create", isLoggedIn, setTransactionPinCtrl);
pinRoutes.post("/send-reset-otp", isLoggedIn, sendPinResetOtpCtrl);
pinRoutes.post("/reset", isLoggedIn, resetTransactionPinCtrl);

export default pinRoutes;