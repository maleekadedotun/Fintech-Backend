import {
    getAirtimeNetworks,
    purchaseAirtime
} from "./airtime.js";

import {
    purchaseData,
    getDataPlans,
} from "./data.js";

export default {
    buyAirtime: purchaseAirtime,
    getAirtimeNetworks,
    purchaseDataBundle: purchaseData,
    getDataPlans,
};