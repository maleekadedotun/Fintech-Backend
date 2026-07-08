// routes/testRoute.js

import express from "express";
import { getNetworks } from "../../services/providers/smePlug/network.js ";
import { getDataPlans, purchaseData } from "../../services/providers/smeplug/data.js";

// import { getNetworks } from "../services/providers/smeplug/network.js";

const testRouter = express.Router();

testRouter.get("/networks", async (req, res) => {
    try {
        const result = await getNetworks();

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});



testRouter.post("/buy-data", async (req, res) => {
    try {
        const result = await purchaseData({
            networkId: req.body.networkId,
            planId: req.body.planId,
            phone: req.body.phone,
            reference: "TEST-" + Date.now(),
        });

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

testRouter.get("/plans/:networkId", async (req, res) => {
    try {
        const result = await getDataPlans(
            req.params.networkId
        );

        res.json(result);

    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
});


export default testRouter;