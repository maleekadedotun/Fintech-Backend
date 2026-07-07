import express from "express";

const adminRouter = express.Router();
import isAdmin from "../../middleware/isAdmin.js";

import {getAdminStatsCtrl,getTopUsersCtrl} from "../../controllers/admin/adminCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";
import { getRevenueStatsCtrl } from "../../controllers/admin/getRevenueStatsCtrl.js";
import { reverseTransferCtrl } from "../../controllers/reverse/reverseCtrl.js";
import { adminDashboardCtrl } from "../../controllers/admin/adminDashboardCtrl.js";

adminRouter.get("/admin-stats", isLoggedIn, isAdmin, getAdminStatsCtrl);

adminRouter.get("/top-users", isLoggedIn, isAdmin, getTopUsersCtrl);
adminRouter.get("/admin-revenue", isLoggedIn, isAdmin, getRevenueStatsCtrl);
adminRouter.post("/reverse-transfer/:reference", isLoggedIn, isAdmin, reverseTransferCtrl);
adminRouter.get("/dashboard", isLoggedIn, isAdmin, adminDashboardCtrl);

export default adminRouter;