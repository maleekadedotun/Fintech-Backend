import { purchaseBetting } from "./betting.js";
import {
    buyCable,
    verifySmartCard,
    getCablePlans,
} from "./cable.js";
import { getEducationPlans, purchaseEducation } from "./education.js";

import {
    purchaseElectricity,
    verifyMeter,
} from "./electricity.js";
import { getInsurancePlans, purchaseInsurance } from "./insurance.js";
import { getInternetPlans, purchaseInternet, verifyInternet } from "./internet.js";

// import {
//     placeBet,
// } from "./betting.js";

export default {
    purchaseCable: buyCable,
    verifySmartCard,
    getCablePlans,

    purchaseElectricity,
    verifyMeter,

    purchaseInternet,
    getInternetPlans,
    verifyInternet,
    
    purchaseEducation,
    getEducationPlans,
    purchaseBetting,
    purchaseInsurance,
    getInsurancePlans,
    // placeBet,
};