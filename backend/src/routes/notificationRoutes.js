const express = require("express");

const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const auth = require("../middleware/auth");


// GET NOTIFICATIONS
router.get(
  "/",
  auth,
  getMyNotifications
);


// MARK ONE READ
router.patch(
  "/:id/read",
  auth,
  markAsRead
);


// MARK ALL READ
router.patch(
  "/read-all",
  auth,
  markAllAsRead
);


// DELETE
router.delete(
  "/:id",
  auth,
  deleteNotification
);

module.exports = router;