import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { buyDataCtrl, getDataPlansCtrl } from "../../controllers/dataPlan/dataPlanCtrl.js";

const dataPlanRouter = express.Router();

dataPlanRouter.get("/data-plans/:network", isLoggedIn, getDataPlansCtrl);
dataPlanRouter.post("/data-purchase", isLoggedIn, buyDataCtrl);

export default dataPlanRouter;