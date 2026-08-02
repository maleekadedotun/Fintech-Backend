import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { buyElectricityCtrl, verifyMeterCtrl } from "../../controllers/electricity/electricityCtrl.js";

const electricityRoute = express.Router();


electricityRoute.post("/purchase", isLoggedIn, buyElectricityCtrl);
electricityRoute.post("/verify", isLoggedIn, verifyMeterCtrl);

export default electricityRoute;