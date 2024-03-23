import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    if (!req.params.userId) {
      res.status(500).json({ message: "Please Provide UserId" });
    }

    const notifications = await Notification.find({
      users: { $in: [req.params.userId] },
    })
      .populate("users", "-password -followers -followings")
      .populate("chat")
      .sort({ updatedAt: -1 });

    return res
      .status(200)
      .json({ success: true, notifications: notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markNotification = async (req, res) => {
  try {
    if (!req.params.notificationId) {
      return res.status(500).json({ message: "Please Send Notification Id" });
    }
    if (!req.params.userId) {
      return res.status(500).json({ message: "Please Send UserId" });
    }
    await Notification.findByIdAndUpdate(req.params.notificationId, {
      $pull: { users: req.params.userId },
    });
    return res.status(200).json({ success: true, message: "Marked as Read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
