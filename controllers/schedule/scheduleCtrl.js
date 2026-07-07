import ScheduledTransfer from "../../models/schedule/scheduledTransfer.js";
import Wallet from "../../models/Wallet/Wallet.js";

export const createScheduledTransferCtrl = async (req, res) => {
  try {
    const {
      receiverAccountNumber,
      amount,
      frequency,
      nextRun,
    } = req.body;

    if (!receiverAccountNumber) {
      return res.status(400).json({
        message: "Receiver account number is required",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const receiverWallet = await Wallet.findOne({
      accountNumber: receiverAccountNumber,
    });

    if (!receiverWallet) {
      return res.status(404).json({
        message: "Receiver account not found",
      });
    }

    const transfer = await ScheduledTransfer.create({
      user: req.userAuth,
      receiverAccountNumber,
      amount,
      frequency,
      nextRun,
    });

    res.status(201).json({
      message: "Scheduled transfer created successfully",
      transfer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getScheduledTransfersCtrl = async (req, res) => {
  try {
    const transfers = await ScheduledTransfer.find({
      user: req.userAuth,
    }).sort({ createdAt: -1 });

    res.json({
      count: transfers.length,
      transfers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const pauseScheduledTransferCtrl = async (req, res) => {
  try {
    const transfer = await ScheduledTransfer.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userAuth,
      },
      {
        status: "paused",
      },
      {
        new: true,
      }
    );

    if (!transfer) {
      return res.status(404).json({
        message: "Scheduled transfer not found",
      });
    }

    res.json({
      message: "Scheduled transfer paused",
      transfer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resumeScheduledTransferCtrl = async (req, res) => {
  try {
    const transfer = await ScheduledTransfer.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userAuth,
      },
      {
        status: "active",
      },
      {
        new: true,
      }
    );

    if (!transfer) {
      return res.status(404).json({
        message: "Scheduled transfer not found",
      });
    }

    res.json({
      message: "Scheduled transfer resumed",
      transfer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteScheduledTransferCtrl = async (req, res) => {
  try {
    const transfer = await ScheduledTransfer.findOneAndDelete({
      _id: req.params.id,
      user: req.userAuth,
    });

    if (!transfer) {
      return res.status(404).json({
        message: "Scheduled transfer not found",
      });
    }

    res.json({
      message: "Scheduled transfer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};