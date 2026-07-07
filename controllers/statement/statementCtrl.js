import Transaction from "../../models/Transaction/Transaction.js";
import { generateStatement } from "../../services/statementService.js";
// import { generateStatement } from "../services/statementService.js";


export const getStatementCtrl = async (req, res) => {
    try {
        const { from, to } = req.query;

        const filter = {
            user: req.userAuth,
        };

        if (from && to) {
            filter.createdAt = {
                $gte: new Date(from),
                $lte: new Date(to),
            };
        }

        const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

        res.json({
            count: transactions.length,
            transactions,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


export const downloadStatementCtrl = async (req, res) => {
    try {
        const { from, to } = req.query;

        const pdfBuffer = await generateStatement({
            userId: req.userAuth,
            from,
            to,
        });

        // const today = new Date().toISOString().split("T")[0];
        const now = new Date();

        const timestamp = now.toISOString().replace(/[:.]/g, "-").replace("T", "_").replace("Z", "");

        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            // `attachment; filename=account-statement-${today}.pdf`
            `attachment; filename=account-statement-${timestamp}.pdf`
        );

        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};