import Revenue from "../../models/Revenue/Revenue.js";

// import Revenue from "../../models/Revenue.js";
Revenue

export const getRevenueStatsCtrl = async (req, res) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayRevenue = await Revenue.aggregate(
      [
        {
          $match: {
            createdAt: {
              $gte: today
            }
          }
        },
        {
          $group: {
            _id: null,
            profit: {
              $sum: "$profit"
            }
          }
        }
      ]
    );

    const monthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // const dailyRevenue = await Revenue.aggregate(
    //   [
    //     {
    //       $group: {
    //         _id: {
    //           day: {
    //             $dayOfMonth: "$createdAt"
    //           }
    //         },
    //         profit: {
    //           $sum: "$profit"
    //         }
    //       }
    //     }
    //   ]
    // );

    const dailyRevenue = await Revenue.aggregate(
      [
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" }
            },
            profit: {
              $sum: "$profit"
            }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1
          }
        }
      ]
    );

    const totalRevenue = await Revenue.aggregate([
      {
        $match: {
          createdAt: {
            $gte: monthStart
          }
        }
      },
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

    // res.json({
    //   totalRevenue: totalRevenue[0]?.totalProfit || 0,
    //   totalVolume: totalRevenue[0]?.totalVolume || 0,
    //   breakdown,
    //   todayRevenue: todayRevenue[0]?.profit || 0,
    //   dailyRevenue: dailyRevenue.map((item) => ({
    //     day: item._id.day,
    //     profit: item.profit
    //   }))
    // });

    res.json({
      summary: {
        platformProfit: totalRevenue[0]?.totalProfit || 0,
        transactionVolume: totalRevenue[0]?.totalVolume || 0,
        todayProfit: todayRevenue[0]?.profit || 0,
      },

      breakdown,


      dailyRevenue: dailyRevenue.map(item => ({
        date: `${item._id.year}-${item._id.month}-${item._id.day}`,
        profit: item.profit,
      })),
      
      // dailyRevenue: dailyRevenue.map(item => ({
      //   date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
      //   profit: item.profit,
      // }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};