import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { createScheduledTransferCtrl, deleteScheduledTransferCtrl, getScheduledTransfersCtrl, pauseScheduledTransferCtrl, resumeScheduledTransferCtrl } from "../../controllers/schedule/scheduleCtrl.js";

const scheduleRoutes = express.Router();

scheduleRoutes.post("/transfer-schedule", isLoggedIn, createScheduledTransferCtrl);
scheduleRoutes.get("/", isLoggedIn, getScheduledTransfersCtrl);
scheduleRoutes.get("/", isLoggedIn, pauseScheduledTransferCtrl);
scheduleRoutes.patch("/:id/pause", isLoggedIn, pauseScheduledTransferCtrl);
scheduleRoutes.patch("/:id/resume", isLoggedIn, resumeScheduledTransferCtrl);
scheduleRoutes.delete("/:id/delete", isLoggedIn, deleteScheduledTransferCtrl);

export default scheduleRoutes;