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


// const isAdmin = async (req, res, next) => {
//     // get token from headers
//     const token = getTokenFromHeaders(req);
//     // verify token
//     const decodedUser = await verifyToken(token);
//     //save the user into the req obj
//     req.userAuth = decodedUser.id;
//     console.log(decodedUser.id, "Admin");
//     const user = await User.findById(decodedUser.id);
//     //  console.log(user, "userId");

//     if (user.isAdmin) {
//         next();
//     }
//     else {
//         res.json({
//             status: "Failed",
//             message: "Access denied, Admins only"
//         })
//     }

// }
// export default isAdmin;


const isAdmin = async (req, res, next) => {
    try {

        const token = getTokenFromHeaders(req);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decodedUser = await verifyToken(token);

        req.userAuth = decodedUser.id;

        const user = await User.findById(decodedUser.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.role !== "admin" && !user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only.",
            });
        }

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });

    }
};

export default isAdmin;




// second


// import User from "../models/User/user.js";

// const isAdmin = async (req, res, next) => {

//     const user = await User.findById(req.userAuth);

//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found",
//         });
//     }

//     if (user.role !== "admin") {
//         return res.status(403).json({
//             success: false,
//             message: "Access denied. Admin only.",
//         });
//     }

//     next();
// };

// export default isAdmin;