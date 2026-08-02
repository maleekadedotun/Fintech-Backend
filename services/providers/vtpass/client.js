import axios from "axios";

console.log("VTpass Base URL:", process.env.VTPASS_BASE_URL);

// VTpass supports two auth modes depending on account setting:
// "Basic" mode  → Authorization: Basic base64(username:password)
// "API keys" mode → api-key + secret-key headers
// Your sandbox is set to "Basic" mode.
const vtpassClient = axios.create({
    baseURL: process.env.VTPASS_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    auth: {
        username: process.env.VTPASS_USERNAME,
        password: process.env.VTPASS_PASSWORD,
    },
    timeout: 30000,
});

// GET requests (service listings, variations) require: api-key + public-key
export const vtpassGetClient = axios.create({
    baseURL: process.env.VTPASS_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "api-key": process.env.VTPASS_API_KEY,
        "public-key": process.env.VTPASS_PUBLISHABLE_KEY,
    },
    timeout: 30000,
});
// console.log({
//   apiKey: process.env.VTPASS_API_KEY,
//   publicKey: process.env.VTPASS_PUBLISHABLE_KEY,
//   secretKey: process.env.VTPASS_SECRET_KEY,
// });

// vtpassClient.interceptors.request.use((config) => {
//     console.log("========== REQUEST ==========");
//     console.log("URL:", config.baseURL + config.url);
//     console.log("Headers:", config.headers);
//     console.log("Body:", config.data);
//     console.log("=============================");
//     return config;
// });
export default vtpassClient;