import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import {
    buyInternetCtrl,
    verifyInternetCtrl,
    getInternetPlansCtrl,
    getInternetProvidersCtrl,
} from "../../controllers/internet/internetCtrl.js";

const internetRouter = express.Router();

internetRouter.get("/providers", getInternetProvidersCtrl);
internetRouter.get("/plans/:providerId", getInternetPlansCtrl);
internetRouter.post("/purchase-internet", isLoggedIn, buyInternetCtrl);
internetRouter.post("/verify-internet", isLoggedIn, verifyInternetCtrl);

export default internetRouter;