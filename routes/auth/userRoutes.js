import express from "express";
import { registerUserCtrl, loginUserCtrl, fetchAllUserCtrl } from "../../controllers/auth/userCtrl.js";
const userRouter = express.Router();

userRouter.post("/register", registerUserCtrl);
userRouter.post("/login", loginUserCtrl);
userRouter.get("/", fetchAllUserCtrl);

export default userRouter;
