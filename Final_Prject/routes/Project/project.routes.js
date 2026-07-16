const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/Project/project.controller.js");
const protect = require("../../middleware/auth.middleware.js");

router.use(protect);
router
  .route("/workspace/:workspaceId/projects")
  .post(projectController.createProject)
  .get(projectController.getAllProjects);
router
  .route("/projects/:id")
  .get(projectController.getProjectById)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
