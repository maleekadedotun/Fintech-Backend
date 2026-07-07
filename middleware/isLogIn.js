import getTokenFromHeaders from "../utils/getTokenFromHeader.js";
import verifyToken from "../utils/verifyToken.js";

// const verifyToken = require("../utils/verifyToken");
const isLoggedIn = async (req, res, next) => {
  // get token from headers
  const token = getTokenFromHeaders(req);
  // verify token
  const decodedUser = await verifyToken(token);
  //save the user into the req obj
  req.userAuth = decodedUser.id;
  if (!decodedUser) {
    return res.json({
      status: "Failed",
      msg: "Invalid/Expired token, please login again",
    });
  }
  else {
    next();
  }

}
export default isLoggedIn;