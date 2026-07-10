const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/Task/task.controller.js");

router
  .route("/project/:projectId/task")
  .post(taskController.createTask)
  .get(taskController.getAllTasks);

router
  .route("/task/:id")
  .get(taskController.getTaskById)
  .patch(taskController.updateTaskById)
  .delete(taskController.deleteTaskById);

module.exports = router;
