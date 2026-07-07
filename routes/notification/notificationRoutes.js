import express from "express";
import { getNotificationsCtrl, markNotificationReadCtrl } from "../../controllers/notification/notificationCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", isLoggedIn, getNotificationsCtrl);

notificationRoutes.patch("/:id/read", isLoggedIn, markNotificationReadCtrl);

export default notificationRoutes