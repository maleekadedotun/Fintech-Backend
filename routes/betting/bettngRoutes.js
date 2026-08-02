import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { buyBettingCtrl } from "../../controllers/betting/bettingCtrl.js";

const bettingRouter = express.Router();

bettingRouter.post(
    "/purchase-betting",
    isLoggedIn,
    buyBettingCtrl
);

// bettingRouter.post(
//     "/verify",
//     verifyBettingCtrl
// );

export default bettingRouter;