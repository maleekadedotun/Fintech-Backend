import Beneficiary from "../../models/Beneficiary/Beneficiary.js";
import Wallet from "../../models/Wallet/Wallet.js";


export const addBeneficiaryCtrl = async (req, res) => {
  try {
    const { name, accountNumber, bankName } = req.body;

    const exists = await Beneficiary.findOne({
      user: req.userAuth,
      accountNumber,
    });

    if (exists) {
      return res.status(400).json({
        message: "Beneficiary already exists",
      });
    }

    const wallet = await Wallet.findOne({
      accountNumber,
    }).populate("user", "name");

    if (!wallet) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const beneficiary = await Beneficiary.create({
      user: req.userAuth,
      name: wallet.user.name,
      accountNumber: wallet.accountNumber,
      bankName: "My Fintech",
    });

    // const beneficiary = await Beneficiary.create({
    //   user: req.userAuth,
    //   name,
    //   accountNumber,
    //   bankName,
    // });

    const myWallet = await Wallet.findOne({
      user: req.userAuth,
    });

    if (myWallet.accountNumber === accountNumber) {
      return res.status(400).json({
        message: "You cannot add yourself as beneficiary",
      });
    }

    res.json({
      message: "Beneficiary added",
      beneficiary,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBeneficiariesCtrl = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({
      user: req.userAuth,
    }).sort({ createdAt: -1 });

    res.json({
      count: beneficiaries.length,
      beneficiaries,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBeneficiaryCtrl = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOneAndDelete({
      _id: req.params.id,
      user: req.userAuth,
    });

    if (!beneficiary) {
      return res.status(404).json({
        message: "Beneficiary not found",
      });
    }

    res.json({
      message: "Beneficiary deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const deleteBeneficiaryCtrl = async (req, res) => {

//   try {
//     // const { id } = req.params;

//     await Beneficiary.findByIdAndDelete(
//       // _id: id,
//       req.params.id
//     );

//     res.json({
//       message: "Beneficiary deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };