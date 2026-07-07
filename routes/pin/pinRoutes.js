import express from "express";
import { setTransactionPinCtrl } from "../../controllers/pin/pinCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";

const pinRoutes = express.Router();

pinRoutes.post("/create", isLoggedIn, setTransactionPinCtrl);

export default pinRoutes;