import User from "../../models/User/user.js";
import Wallet from "../../models/Wallet/Wallet.js";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken.js";
// generateToken
// import generateToken from "../utils/generateToken.js";

// @desc Register user
// @route POST /api/auth/register
export const registerUserCtrl = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ 
    name, 
    email, 
    password: hashedPassword 
  });


  // AUTO-CREATE WALLET
  await Wallet.create({
    user: user._id,
    balance: 0,
  });

  res.status(201).json({
   status: "success",
   data: user,
    // token: generateToken(user._id),
  });
};

// @desc Login user
// @route POST /api/auth/login
export const loginUserCtrl = async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });
  if (!userFound) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isPasswordMatched = await bcrypt.compare(password, userFound.password);
  if (!isPasswordMatched) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    status: "success",
    data: {
      _id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      token: generateToken(userFound._id),
    },
  }); 
};

// @route POST /api/auth/l
export const fetchAllUserCtrl = async (req, res) => {

  const users = await User.find();
  try{
    if (!users) {
      return res.status(401).json({ message: "Users not found" });
    }

    res.json({
      status: "success",
      data: users,
    }); 
  }
  catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
