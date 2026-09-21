const Notification = require(
  "../models/Notification"
);

// GET ALL
exports.getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        recipient: req.user.id,
      })
        .populate(
          "sender",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    const unreadCount =
      await Notification.countDocuments({
        recipient: req.user.id,
        isRead: false,
      });

    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch notifications",
    });
  }
};

// MARK ONE READ
exports.markRead = async (
  req,
  res
) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

// MARK ALL READ
exports.markAllRead = async (
  req,
  res
) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.id,
      },
      {
        isRead: true,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

// DELETE
exports.deleteNotification =
  async (req, res) => {
    try {
      await Notification.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
    }
  };