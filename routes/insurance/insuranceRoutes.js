import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { insuranceCtrl } from "../../controllers/insurance/insuranceCtrl.js";

const insuranceRoutes = express.Router();

insuranceRoutes.post("/purchase-insurance", isLoggedIn, insuranceCtrl)

export default insuranceRoutes;