// services/providers/smeplug/client.js

import axios from "axios";

const smePlugClient = axios.create({
    baseURL: "https://smeplug.ng/api/v1",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SMEPLUG_API_KEY}`,
    },
    timeout: 30000,
});

export default smePlugClient;