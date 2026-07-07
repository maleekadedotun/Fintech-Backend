// import User from "../models/User/user.js";

import User from "../models/User/user.js";
import getTokenFromHeaders from "../utils/getTokenFromHeader.js";
import verifyToken from "../utils/verifyToken.js";

// const isAdmin = async (req, res, next) => {
//     // console.log("req.userAuth:", req.userAuth);
//   try {
//     const user = await User.findById(req.userAuth);
//     // console.log(user, "usersssss");
    

//     if (!user || user.role !== "admin") {
//       return res.status(403).json({
//         message: "Access denied. Admin only.",
//       });
//     }

//     next();
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// export default isAdmin;

// import User from "../model/User/user.js";
// import getTokenFromHeaders from"../utils/getTokenFromHeaders.js";
// import verifyToken from "../utils/verifyToken.js";


const isAdmin = async (req, res, next) => {
    // get token from headers
    const token = getTokenFromHeaders(req);
    // verify token
    const decodedUser = await verifyToken(token);
    //save the user into the req obj
    req.userAuth = decodedUser.id;
    console.log(decodedUser.id, "Admin");
    const user = await User.findById(decodedUser.id);
    //  console.log(user, "userId");

    if (user.isAdmin) {
        next();
    }
    else {
        res.json({
            status: "Failed",
            message: "Access denied, Admins only"
        })
    }

}
export default isAdmin;