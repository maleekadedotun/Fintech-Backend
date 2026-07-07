import Transaction from "../models/Transaction/Transaction.js";
import User from "../models/User/user.js";
import Wallet from "../models/Wallet/Wallet.js";
import { generateStatementPDF } from "../utils/pdfGenerator.js";


export const generateStatement = async ({
    userId,
    from,
    to,
}) => {
    // Find user
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    // Find wallet
    const wallet = await Wallet.findOne({
        user: userId,
    });

    if (!wallet) {
        throw new Error("Wallet not found");
    }

    // Build query
    const query = {
        user: userId,
    };

    // Apply date filters if provided
    if (from || to) {
        query.createdAt = {};

        if (from) {
            query.createdAt.$gte = new Date(from);
        }

        if (to) {
            const endDate = new Date(to);
            endDate.setHours(23, 59, 59, 999);

            query.createdAt.$lte = endDate;
        }
    }

    // Get transactions
    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    // Generate PDF
    const pdfBuffer = await generateStatementPDF({
        user,
        wallet,
        transactions,
        period: {
            from,
            to,
        },
    });

    return pdfBuffer;
};