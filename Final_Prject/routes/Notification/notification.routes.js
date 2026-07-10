const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/Notification/notification.controller.js");

router
  .route("/user/:userId/notification")
  .post(notificationController.createNotification)
  .get(notificationController.getAllNotifications);

router
  .route("/notification/:id")
  .get(notificationController.getNotificationById)
  .patch(notificationController.updateNotificationById)
  .delete(notificationController.deleteNotificationById);

module.exports = router;
