import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { buyInternetCtrl, verifyInternetCtrl } from "../../controllers/internet/internetCtrl.js";
import { verifyInternet } from "../../services/providers/vtpass/internet.js";

const internetRouter = express.Router();

internetRouter.post("/purchase-internet", isLoggedIn, buyInternetCtrl)
internetRouter.post("/verify-internet", isLoggedIn, verifyInternetCtrl)

export default internetRouter