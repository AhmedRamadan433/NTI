const express = require("express");
const router = express.Router();
const messageController = require("../../controllers/Message/message.controller.js");

router
  .route("/chat/:chatId/message")
  .post(messageController.createMessage)
  .get(messageController.getAllMessages);

router
  .route("/message/:id")
  .get(messageController.getMessageById)
  .patch(messageController.updateMessageById)
  .delete(messageController.deleteMessageById);

module.exports = router;
