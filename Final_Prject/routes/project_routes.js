const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project_controller");
const protect = require("../middleware/auth.middleware.js");
const restrictTo = require("../middleware/authorization.middleware.js");
router.use(protect);
router
  .route("/")
  .post(projectController.createProject)
  .get(projectController.getAllProjects);
router
  .route("/:id")
  .get(projectController.getProjectById)
  .patch(restrictTo("Admin"), projectController.updateProject)
  .delete(restrictTo("Admin"), projectController.deleteProject);

module.exports = router;
