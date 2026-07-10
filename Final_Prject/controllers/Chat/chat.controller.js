const Chat = require("../../models/chat.model.js");
const Workspace = require("../../models/workspace.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

const createChat = asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const workspaceId = req.params.workspaceId || data.workspace;

  if (!workspaceId) {
    return next(new AppError("Workspace id is required", 400, HttpStatus.FAIL));
  }

  const workspace = await Workspace.exists({ _id: workspaceId });
  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }

  const chat = await Chat.create({
    ...data,
    workspace: workspaceId,
  });

  const populatedChat = await Chat.findById(chat._id)
    .populate("workspace", "name owner")
    .populate("participants", "firstName lastName username email")
    .populate("project", "projectName projectStatus")
    .populate("team", "name")
    .populate("lastMessage", "content createdAt");

  res.status(201).json({ status: HttpStatus.SUCCESS, data: populatedChat });
});

const getAllChats = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;
  const query = {};

  if (workspaceId) {
    const workspace = await Workspace.exists({ _id: workspaceId });
    if (!workspace) {
      return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
    }
    query.workspace = workspaceId;
  }

  const chats = await Chat.find(query)
    .populate("workspace", "name owner")
    .populate("participants", "firstName lastName username email")
    .populate("project", "projectName projectStatus")
    .populate("team", "name")
    .populate("lastMessage", "content createdAt");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: chats });
});

const getChatById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const chat = await Chat.findById(id)
    .populate("workspace", "name owner")
    .populate("participants", "firstName lastName username email")
    .populate("project", "projectName projectStatus")
    .populate("team", "name")
    .populate("lastMessage", "content createdAt");

  if (!chat) {
    return next(new AppError("Chat not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({ status: HttpStatus.SUCCESS, data: chat });
});

const updateChatById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const existingChat = await Chat.findById(id);
  if (!existingChat) {
    return next(new AppError("Chat not found", 404, HttpStatus.FAIL));
  }

  if (data.workspace) {
    const workspace = await Workspace.exists({ _id: data.workspace });
    if (!workspace) {
      return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
    }
  }

  const chat = await Chat.findByIdAndUpdate(id, data, {
    runValidators: true,
    returnDocument: "after",
  })
    .populate("workspace", "name owner")
    .populate("participants", "firstName lastName username email")
    .populate("project", "projectName projectStatus")
    .populate("team", "name")
    .populate("lastMessage", "content createdAt");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: chat });
});

const deleteChatById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const chat = await Chat.findByIdAndDelete(id);
  if (!chat) {
    return next(new AppError("Chat not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: null,
    message: "Chat deleted successfully",
  });
});

module.exports = {
  createChat,
  getAllChats,
  getChatById,
  updateChatById,
  deleteChatById,
};
