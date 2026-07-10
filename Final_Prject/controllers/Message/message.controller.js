const Message = require("../../models/message.model.js");
const Chat = require("../../models/chat.model.js");
const User = require("../../models/user.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

const createMessage = asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const chatId = req.params.chatId || data.chat;

  if (!chatId) {
    return next(new AppError("Chat id is required", 400, HttpStatus.FAIL));
  }

  const chat = await Chat.exists({ _id: chatId });
  if (!chat) {
    return next(new AppError("Chat not found", 404, HttpStatus.FAIL));
  }

  const senderId = data.sender || req.user?._id || req.user?.id;
  if (!senderId) {
    return next(new AppError("Sender id is required", 400, HttpStatus.FAIL));
  }

  const sender = await User.exists({ _id: senderId });
  if (!sender) {
    return next(new AppError("Sender not found", 404, HttpStatus.FAIL));
  }

  if (data.receiver) {
    const receiver = await User.exists({ _id: data.receiver });
    if (!receiver) {
      return next(new AppError("Receiver not found", 404, HttpStatus.FAIL));
    }
  }

  const message = await Message.create({
    ...data,
    chat: chatId,
    sender: senderId,
  });

  const populatedMessage = await Message.findById(message._id)
    .populate("chat", "name type workspace")
    .populate("sender", "firstName lastName username email")
    .populate("receiver", "firstName lastName username email")
    .populate("attachments", "fileName fileUrl mimeType size");

  res.status(201).json({ status: HttpStatus.SUCCESS, data: populatedMessage });
});

const getAllMessages = asyncWrapper(async (req, res, next) => {
  const { chatId } = req.params;
  const query = {};

  if (chatId) {
    const chat = await Chat.exists({ _id: chatId });
    if (!chat) {
      return next(new AppError("Chat not found", 404, HttpStatus.FAIL));
    }
    query.chat = chatId;
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .populate("chat", "name type workspace")
    .populate("sender", "firstName lastName username email")
    .populate("receiver", "firstName lastName username email")
    .populate("attachments", "fileName fileUrl mimeType size");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: messages });
});

const getMessageById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const message = await Message.findById(id)
    .populate("chat", "name type workspace")
    .populate("sender", "firstName lastName username email")
    .populate("receiver", "firstName lastName username email")
    .populate("attachments", "fileName fileUrl mimeType size");

  if (!message) {
    return next(new AppError("Message not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({ status: HttpStatus.SUCCESS, data: message });
});

const updateMessageById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const existingMessage = await Message.findById(id);
  if (!existingMessage) {
    return next(new AppError("Message not found", 404, HttpStatus.FAIL));
  }

  if (data.chat) {
    const chat = await Chat.exists({ _id: data.chat });
    if (!chat) {
      return next(new AppError("Chat not found", 404, HttpStatus.FAIL));
    }
  }

  if (data.sender) {
    const sender = await User.exists({ _id: data.sender });
    if (!sender) {
      return next(new AppError("Sender not found", 404, HttpStatus.FAIL));
    }
  }

  if (data.receiver) {
    const receiver = await User.exists({ _id: data.receiver });
    if (!receiver) {
      return next(new AppError("Receiver not found", 404, HttpStatus.FAIL));
    }
  }

  const message = await Message.findByIdAndUpdate(
    id,
    {
      ...data,
      isEdited: true,
    },
    {
      runValidators: true,
      returnDocument: "after",
    },
  )
    .populate("chat", "name type workspace")
    .populate("sender", "firstName lastName username email")
    .populate("receiver", "firstName lastName username email")
    .populate("attachments", "fileName fileUrl mimeType size");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: message });
});

const deleteMessageById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const message = await Message.findByIdAndDelete(id);
  if (!message) {
    return next(new AppError("Message not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: null,
    message: "Message deleted successfully",
  });
});

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
};
