// import express from "express";
// import isLoggedIn from "../../middleware/isLogIn.js";
import { buyCableCtrl, getCablePlansCtrl, getCableProvidersCtrl, verifyCableCustomerCtrl } from "../../controllers/cable/cableCtrl.js";

// const cableRouter = express.Router();

// cableRouter.post("/buy-cable", isLoggedIn, buyCableCtrl);

// export default cableRouter;

import express from "express";

// import {
//     buyCableCtrl,
//     getCablePlansCtrl,
//     getCableProvidersCtrl,
//     verifyCableCustomerCtrl,
// } from "../controllers/cable/cableController.js";

import isLoggedIn from "../../middleware/isLogIn.js";

const cableRouter = express.Router();

cableRouter.get(
    "/providers",
    isLoggedIn,
    getCableProvidersCtrl
);

cableRouter.get(
    "/plans/:providerId",
    isLoggedIn,
    getCablePlansCtrl
);

cableRouter.post(
    "/verify",
    isLoggedIn,
    verifyCableCustomerCtrl
);

cableRouter.post(
    "/buy-cable",
    isLoggedIn,
    buyCableCtrl
);

export default cableRouter;