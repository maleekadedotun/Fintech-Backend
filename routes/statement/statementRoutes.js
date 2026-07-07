import express from "express";
import isLoggedIn from "../../middleware/isLogIn.js";
import { downloadStatementCtrl, getStatementCtrl } from "../../controllers/statement/statementCtrl.js";

const statementRoutes = express.Router();

statementRoutes.get("/get-statement", isLoggedIn, getStatementCtrl);
statementRoutes.get("/download-statement", isLoggedIn, downloadStatementCtrl);

export default statementRoutes;