const express = require("express");
const router = express.Router();

const {
  getWorkspaceSettings,
  updateWorkspaceSettings,
} = require("../../controllers/settings/workspace.settings.controller.js");

const {
  getProjectSettings,
  updateProjectSettings,
} = require("../../controllers/settings/project.settings.controller.js");

router
  .route("/workspace/:workspaceId")
  .get(getWorkspaceSettings)
  .patch(updateWorkspaceSettings);

router
  .route("/project/:projectId")
  .get(getProjectSettings)
  .patch(updateProjectSettings);

module.exports = router;
