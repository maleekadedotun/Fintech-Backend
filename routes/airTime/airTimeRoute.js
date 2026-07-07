import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { buyAirTimeCtrl } from "../../controllers/airtime/airTimeCtrl.js";

const airTimeRouter = express.Router();

airTimeRouter.post("/buy-airTime", isLoggedIn, buyAirTimeCtrl);

export default airTimeRouter