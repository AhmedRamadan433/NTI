const express = require("express");
const router = express.Router();
const attachmentController = require("../../controllers/Attachment/attachment.controller.js");
const upload = require("../../middleware/multer.middleware.js");

router
  .route("/attachment")
  .post(
    (req, res, next) => {
      req.uploadFolder = ""; // used by asyncWrapper to clean up this file if creation fails
      next();
    },
    upload.single("file"),
    attachmentController.createAttachment,
  )
  .get(attachmentController.getAllAttachments);

router
  .route("/attachment/:id")
  .get(attachmentController.getAttachmentById)
  .patch(
    (req, res, next) => {
      req.uploadFolder = "";
      next();
    },
    upload.single("file"),
    attachmentController.updateAttachmentById,
  )
  .delete(attachmentController.deleteAttachmentById);

module.exports = router;
