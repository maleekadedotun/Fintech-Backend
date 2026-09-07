import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import {
    educationCtrl,
    getEducationProvidersCtrl,
    getEducationPlansCtrl,
    verifyInternetCtrl,
} from "../../controllers/education/educationCtrl.js";

const educationRouter = express.Router();

educationRouter.get("/get-educations", isLoggedIn, getEducationProvidersCtrl);
educationRouter.get("/providers", isLoggedIn, getEducationProvidersCtrl);
educationRouter.get("/plans/:providerId", isLoggedIn, getEducationPlansCtrl);
educationRouter.post("/purchase-education", isLoggedIn, educationCtrl);
educationRouter.post("/verify-education", isLoggedIn, verifyInternetCtrl);

export default educationRouter;