const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/Chat/chat.controller.js");

router
  .route("/workspace/:workspaceId/chat")
  .post(chatController.createChat)
  .get(chatController.getAllChats);

router
  .route("/chat/:id")
  .get(chatController.getChatById)
  .patch(chatController.updateChatById)
  .delete(chatController.deleteChatById);

module.exports = router;
