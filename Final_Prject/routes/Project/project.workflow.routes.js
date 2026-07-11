const express = require("express");
const projectWorkflowController = require("../../controllers/Project/project.workflow.controller.js");
const isAdminOrOwnerForProject = require("../../middleware/Project/isAdminOrOwner.project.js");

const router = express.Router();

router
  .route("/project/:projectId/archive")
  .patch(isAdminOrOwnerForProject, projectWorkflowController.archiveProject);

router
  .route("/project/:projectId/restore")
  .patch(isAdminOrOwnerForProject, projectWorkflowController.restoreProject);

module.exports = router;
