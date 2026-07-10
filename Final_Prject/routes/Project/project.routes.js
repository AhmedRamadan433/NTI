const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/Project/project.controller.js");
const protect = require("../../middleware/auth.middleware.js");
const isAdminOrOwnerForProject = require("../../middleware/Project/isAdminOrOwner.project.js");
router.use(protect);
router
  .route("/workspace/:workspaceId/project")
  .post(projectController.createProject)
  .get(projectController.getAllProjects);
router
  .route("/project/:id")
  .get(projectController.getProjectById)
  .patch(isAdminOrOwnerForProject, projectController.updateProject)
  .delete(isAdminOrOwnerForProject, projectController.deleteProject);

module.exports = router;
