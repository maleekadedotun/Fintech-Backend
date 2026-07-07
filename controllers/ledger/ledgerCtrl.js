import Ledger from "../../models/Ledger/Ledger.js";
import { createLedgerEntry } from "../../helpers/ledgerHelper.js";
import crypto from "crypto";


const generateRef = () => crypto.randomBytes(10).toString("hex");

export const getLedgerCtrl = async (req, res) => {
    try {
        const entries = await Ledger.find({
            user: req.userAuth,
        }).sort({ createdAt: -1 });

        res.json({
            count: entries.length,
            entries,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};