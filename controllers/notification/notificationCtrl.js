import Notification from "../../models/Notification/Notification.js";


export const getNotificationsCtrl = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        user: req.userAuth,
      }).sort({ createdAt: -1 });

    res.json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const markNotificationReadCtrl =
  async (req, res) => {
    try {
      const { id } = req.params;

      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: id,
            user: req.userAuth,
          },
          {
            isRead: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        message: "Notification updated",
        notification,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };