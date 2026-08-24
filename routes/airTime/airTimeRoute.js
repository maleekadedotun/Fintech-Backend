import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { buyAirTimeCtrl, getAirtimeNetworksCtrl } from "../../controllers/airTime/airTimeCtrl.js";
// import { buyAirTimeCtrl, getAirtimeNetworksCtrl } from "../../controllers/airtime/airTimeCtrl.js";

const airTimeRouter = express.Router();

airTimeRouter.post("/buy-airTime", isLoggedIn, buyAirTimeCtrl);
airTimeRouter.get("/get-networks", isLoggedIn, getAirtimeNetworksCtrl);

export default airTimeRouter