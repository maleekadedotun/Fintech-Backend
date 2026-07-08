import Transaction from "../../models/Transaction/Transaction.js";
import Wallet from "../../models/Wallet/Wallet.js";
import mongoose from "mongoose";
import crypto from "crypto";
import createNotification from "../../helpers/createNotification.js";
import verifyTransactionPin from "../../helpers/verifyTransactionPin.js";
import User from "../../models/User/user.js";
import { buyData } from "../../services/data/dataService.js";
import { dataPlans } from "../../utils/dataPlans.js";



const generateRef = () => crypto.randomBytes(10).toString("hex");


export const getDataPlansCtrl = async (req, res) => {
  const { network } = req.params;

  const plans = dataPlans[network];

  if (!plans) {
    return res.status(404).json({
      message: "Network not found",
    });
  }

  res.json({
    network,
    plans,
  });
};

// buy data plan

// export const buyDataCtrl = async (req, res) => {
//   const session = await mongoose.startSession();

//   try {
//     const user = await User.findById(req.userAuth);

//     if (user.isFrozen) {
//       throw new Error("Account is frozen.");
//     }
//     session.startTransaction();

//     const { phoneNumber, network, planId, pin } = req.body;

//     const plans = dataPlans[network];

//     if (!plans) {
//       throw new Error("Invalid network");
//     }

//     const selectedPlan = plans.find(
//       (plan) => plan.id === planId
//     );

//     if (!selectedPlan) {
//       throw new Error("Invalid data plan");
//     }

//     await verifyTransactionPin(
//       req.userAuth,
//       pin
//     );

//     const wallet = await Wallet.findOne({
//       user: req.userAuth,
//     }).session(session);

//     if (!wallet) {
//       throw new Error("Wallet not found");
//     }

//     if (wallet.balance < selectedPlan.amount) {
//       throw new Error("Insufficient balance");
//     }

//     wallet.balance -= selectedPlan.amount;

//     await wallet.save({ session });

//     const reference = generateRef();

//     await Transaction.create(
//       [
//         {
//           user: req.userAuth,
//           type: "debit",
//           category: "data",
//           amount: selectedPlan.amount,
//           reference,
//           status: "success",
//           metadata: {
//             phoneNumber,
//             network,
//             planId,
//             planName: selectedPlan.name,
//           },
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();

//     await createNotification(
//       req.userAuth,
//       "Data Purchase",
//       `${selectedPlan.name} purchased successfully`
//     );

//     return res.json({
//       message: "Data purchase successful",
//       reference,
//       plan: selectedPlan,
//     });
//   } catch (error) {
//     if (session && session.inTransaction()) {
//       await session.abortTransaction();

//     }

//     return res.status(400).json({
//       message: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };

// controllers/data/buyDataCtrl.js


// export const buyDataCtrl = async (req, res) => {
//   try {
//     const result = await buyData({
//       userId: req.userAuth,
//       phoneNumber: req.body.phoneNumber,
//       network: req.body.network,
//       planId: req.body.planId,
//       amount: req.body.amount,
//       pin: req.body.pin,
//     });

//     return res.status(200).json({
//       status: "success",
//       data: result,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: error.message,
//     });
//   }
// };

export const buyDataCtrl = async (req, res) => {
  try {
    const result = await buyData({
      userId: req.userAuth,
      phone: req.body.phoneNumber,
      networkId: req.body.networkId,
      planId: req.body.planId,
      pin: req.body.pin,
      amount: req.body.amount,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};