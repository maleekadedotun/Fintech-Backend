import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { educationCtrl } from "../../controllers/education/educationCtrl.js";

const educationRouter = express.Router();

educationRouter.post("/purchase-education", isLoggedIn, educationCtrl)
// educationRouter.post("/verify-internet", isLoggedIn, verifyInternetCtrl)

export default educationRouter