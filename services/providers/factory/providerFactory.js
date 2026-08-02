// // import { purchaseData } from "./smeplug/data.js";

// import { purchaseAirtime } from "../smePlug/airtime.js";
// import { buyCable, getCablePlans, getCableProviders, verifySmartCard } from "../smePlug/cable.js";
// import { purchaseData } from "../smePlug/data.js";

// // import { purchaseAirtime } from "./smeplug/airtime.js";

// const providerFactory = () => {

//     return {
//         purchaseDataBundle: purchaseData,
        
//         buyAirtime: purchaseAirtime,
        
//         validateCable: verifySmartCard,

//         purchaseCable: buyCable,

//         getCablePlans: getCablePlans,

//         getCableProviders: getCableProviders,
//     };

// };

// export default providerFactory;
import providerConfig from "../../../config/providerConfig.js";
import { getCablePlans } from "../serviceLayer/getCablePlans.js";

import smePlug from "../smePlug/index.js";
import vtpass from "../vtpass/index.js";

const providers = {
    smeplug: smePlug,
    vtpass,
};

const providerFactory = (category) => {

    const providerName = providerConfig[category];

    // const cablePlans = getCablePlans();
    console.log(providerName, "Name");
    // await getCablePlans(providerId);

    if (!providerName) {
        throw new Error(`No provider configured for ${category}`);
    }

    return providers[providerName];
};

export default providerFactory;