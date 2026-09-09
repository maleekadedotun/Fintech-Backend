import express from "express";
import {
  registerUserCtrl,
  loginUserCtrl,
  fetchAllUserCtrl,
  getProfileCtrl,
} from "../../controllers/auth/userCtrl.js";
import isLoggedIn from "../../middleware/isLogIn.js";

const userRouter = express.Router();

userRouter.post("/register", registerUserCtrl);
userRouter.post("/login", loginUserCtrl);
userRouter.get("/profile", isLoggedIn, getProfileCtrl);
userRouter.get("/", fetchAllUserCtrl);

export default userRouter;
