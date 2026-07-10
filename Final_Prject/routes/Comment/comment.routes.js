const express = require("express");
const router = express.Router();
const commentController = require("../../controllers/Comment/comment.controller.js");

router
  .route("/task/:taskId/comment")
  .post(commentController.createComment)
  .get(commentController.getAllComments);

router
  .route("/comment/:id")
  .get(commentController.getCommentById)
  .patch(commentController.updateCommentById)
  .delete(commentController.deleteCommentById);

module.exports = router;
