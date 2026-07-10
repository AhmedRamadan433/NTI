const Comment = require("../../models/comment.model.js");
const Task = require("../../models/task.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

//// create comment
const createComment = asyncWrapper(async (req, res, next) => {
  const data = req.body;
  const taskId = req.params.taskId || data.task;

  if (!taskId) {
    return next(new AppError("Task id is required", 400, HttpStatus.FAIL));
  }

  const task = await Task.exists({ _id: taskId });
  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }

  const comment = await Comment.create({
    ...data,
    task: taskId,
    author: req.user?._id || req.user?.id,
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate("author", "username email")
    .populate("task", "title status priority");

  res.status(201).json({ status: HttpStatus.SUCCESS, data: populatedComment });
});

//// get all comments (optionally by task)
const getAllComments = asyncWrapper(async (req, res, next) => {
  const { taskId } = req.params;
  const query = { isDeleted: false };

  if (taskId) {
    const task = await Task.exists({ _id: taskId });
    if (!task) {
      return next(new AppError("Task not found", 404, HttpStatus.FAIL));
    }
    query.task = taskId;
  }

  const comments = await Comment.find(query)
    .sort({ createdAt: -1 })
    .populate("author", "username email")
    .populate("task", "title status priority");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: comments });
});

//// get comment by id
const getCommentById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({ _id: id, isDeleted: false })
    .populate("author", "username email")
    .populate("task", "title status priority");

  if (!comment) {
    return next(new AppError("Comment not found", 404, HttpStatus.FAIL));
  }

  res.status(200).json({ status: HttpStatus.SUCCESS, data: comment });
});

//// update comment by id
const updateCommentById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const existingComment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!existingComment) {
    return next(new AppError("Comment not found", 404, HttpStatus.FAIL));
  }

  const currentUserId = req.user?._id || req.user?.id;
  if (String(existingComment.author) !== String(currentUserId)) {
    return next(
      new AppError(
        "You are not allowed to update this comment",
        403,
        HttpStatus.FAIL,
      ),
    );
  }

  delete data.author;
  delete data.task;
  delete data.isDeleted;

  const comment = await Comment.findByIdAndUpdate(
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
    .populate("author", "firstName lastName username email")
    .populate("task", "title status priority");

  res.status(200).json({ status: HttpStatus.SUCCESS, data: comment });
});

//// delete comment by id (soft delete)
const deleteCommentById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const existingComment = await Comment.findOne({ _id: id, isDeleted: false });
  if (!existingComment) {
    return next(new AppError("Comment not found", 404, HttpStatus.FAIL));
  }

  const currentUserId = req.user?._id || req.user?.id;
  if (String(existingComment.author) !== String(currentUserId)) {
    return next(
      new AppError(
        "You are not allowed to delete this comment",
        403,
        HttpStatus.FAIL,
      ),
    );
  }

  await Comment.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      runValidators: true,
    },
  );

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: null,
    message: "Comment deleted successfully",
  });
});

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};
