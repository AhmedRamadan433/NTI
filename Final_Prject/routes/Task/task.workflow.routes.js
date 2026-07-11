const express = require("express");
const taskWorkflowController = require("../../controllers/Task/task.workflow.controller.js");

const router = express.Router();

// Assign or unassign a user from a task.
router
  .route("/task/:taskId/assignee")
  .post(taskWorkflowController.assignUserToTask)
  .delete(taskWorkflowController.unassignUserFromTask);

// Update task workflow fields.
router
  .route("/task/:taskId/status")
  .patch(taskWorkflowController.changeTaskStatus);

router
  .route("/task/:taskId/priority")
  .patch(taskWorkflowController.changeTaskPriority);

// Move a task between a sprint and the backlog.
router
  .route("/task/:taskId/sprint")
  .patch(taskWorkflowController.moveTaskToSprint);

router
  .route("/task/:taskId/backlog")
  .patch(taskWorkflowController.moveTaskToBacklog);

module.exports = router;
