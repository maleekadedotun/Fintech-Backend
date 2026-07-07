import { getDashboardStats } from "../../services/adminDashboardService.js";


export const adminDashboardCtrl = async (req, res) => {
    try {
        const stats = await getDashboardStats();

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};