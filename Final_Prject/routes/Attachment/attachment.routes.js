const express = require("express");
const router = express.Router();
const attachmentController = require("../../controllers/Attachment/attachment.controller.js");

router
  .route("/attachment")
  .post(attachmentController.createAttachment)
  .get(attachmentController.getAllAttachments);

router
  .route("/attachment/:id")
  .get(attachmentController.getAttachmentById)
  .patch(attachmentController.updateAttachmentById)
  .delete(attachmentController.deleteAttachmentById);

module.exports = router;
