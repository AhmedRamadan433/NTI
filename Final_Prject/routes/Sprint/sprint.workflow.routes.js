const express = require("express");
const sprintWorkflowController = require("../../controllers/Sprint/sprint.workflow.controller.js");

const router = express.Router();

router
  .route("/sprints/:sprintId/start")
  .patch(sprintWorkflowController.startSprint);

router
  .route("/sprints/:sprintId/complete")
  .patch(sprintWorkflowController.completeSprint);

module.exports = router;
