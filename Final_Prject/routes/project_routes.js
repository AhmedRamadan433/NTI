const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project_controller");

router
  .route("/")
  .post(projectController.createProject)
  .get(projectController.getAllProjects);
router
  .route("/:id")
  .get(projectController.getProjectById)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
