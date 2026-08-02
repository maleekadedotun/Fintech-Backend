// routes/testRoute.js

import express from "express";
import { getNetworks } from "../../services/providers/smePlug/network.js ";
import { getDataPlans, purchaseData, tesTvPasstPost, testVTpass, testVTpassBetting, testVTpassEducation, testVTpassInsurance, testVTpassInternet, testVTpassInternetSmile } from "../../services/providers/smeplug/data.js";
import { purchaseAirtime } from "../../services/providers/smePlug/airtime.js";

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


testRouter.post("/buy-airtime", async (req, res) => {
    try {
        const result = await purchaseAirtime({
            networkId: req.body.networkId,
            phone: req.body.phone,
            amount: req.body.amount,
            reference: "TEST-" + Date.now(),
        });

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

testRouter.get("/vtpass-cable", async (req, res) => {
    try {
        const result = await testVTpass();

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

testRouter.post("/tvpost-cable", async (req, res) => {
    try {
        const result = await tesTvPasstPost();

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

testRouter.get("/vtpass-internet", async (req, res) => {
    try {
        const result = await testVTpassInternet();

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

testRouter.get("/vtpass-internet-smile", async (req, res) => {
    try {
        const result = await testVTpassInternetSmile();

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

testRouter.get("/vtpass-education", async (req, res) => {
    try {
        const result = await testVTpassEducation();

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

testRouter.get("/vtpass-betting", async (req, res) => {
    try {
        const result = await testVTpassBetting();

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

testRouter.get("/vtpass-insurance", async (req, res) => {
    try {
        const result = await testVTpassInsurance();

        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
});

export default testRouter;