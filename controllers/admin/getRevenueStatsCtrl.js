import Revenue from "../../models/Revenue/Revenue.js";

// import Revenue from "../../models/Revenue.js";
Revenue

export const getRevenueStatsCtrl = async (req, res) => {
  try {
    const totalRevenue = await Revenue.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$profit" },
          totalVolume: { $sum: "$amount" },
        },
      },
    ]);

    const breakdown = await Revenue.aggregate([
      {
        $group: {
          _id: "$type",
          profit: { $sum: "$profit" },
        },
      },
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.totalProfit || 0,
      totalVolume: totalRevenue[0]?.totalVolume || 0,
      breakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};