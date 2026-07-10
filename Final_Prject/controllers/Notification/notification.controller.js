const Notification = require("../../models/notification.model.js");
const User = require("../../models/user.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

const createNotification = asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const recipientId = req.params.userId || data.recipient;

  if (!recipientId) {
    return next(new AppError("Recipient id is required", 400, HttpStatus.FAIL));
  }

  const recipient = await User.exists({ _id: recipientId });
  if (!recipient) {
    return next(new AppError("Recipient not found", 404, HttpStatus.FAIL));
  }

  if (data.sender) {
    const sender = await User.exists({ _id: data.sender });
    if (!sender) {
      return next(new AppError("Sender not found", 404, HttpStatus.FAIL));
    }
  }

  const notification = await Notification.create({
    ...data,
    recipient: recipientId,
    sender: data.sender || req.user?._id || req.user?.id,
  });

  const populatedNotification = await Notification.findById(notification._id)
    .populate("recipient", "firstName lastName username email")
    .populate("sender", "firstName lastName username email");

  res.status(201).json({
    status: HttpStatus.SUCCESS,
    data: populatedNotification,
  });
});

const getAllNotifications = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const query = {};

  if (userId) {
    const recipient = await User.exists({ _id: userId });
    if (!recipient) {
      return next(new AppError("Recipient not found", 404, HttpStatus.FAIL));
    }
    query.recipient = userId;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .populate("recipient", "firstName lastName username email")
    .populate("sender", "firstName lastName username email");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: notifications });
});

const getNotificationById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findById(id)
    .populate("recipient", "firstName lastName username email")
    .populate("sender", "firstName lastName username email");

  if (!notification) {
    return next(new AppError("Notification not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({ status: HttpStatus.SUCCESS, data: notification });
});

const updateNotificationById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const existingNotification = await Notification.findById(id);
  if (!existingNotification) {
    return next(new AppError("Notification not found", 404, HttpStatus.FAIL));
  }

  if (data.recipient) {
    const recipient = await User.exists({ _id: data.recipient });
    if (!recipient) {
      return next(new AppError("Recipient not found", 404, HttpStatus.FAIL));
    }
  }

  if (data.sender) {
    const sender = await User.exists({ _id: data.sender });
    if (!sender) {
      return next(new AppError("Sender not found", 404, HttpStatus.FAIL));
    }
  }

  const notification = await Notification.findByIdAndUpdate(id, data, {
    runValidators: true,
    returnDocument: "after",
  })
    .populate("recipient", "firstName lastName username email")
    .populate("sender", "firstName lastName username email");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: notification });
});

const deleteNotificationById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndDelete(id);
  if (!notification) {
    return next(new AppError("Notification not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: null,
    message: "Notification deleted successfully",
  });
});

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
};
