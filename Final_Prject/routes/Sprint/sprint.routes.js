const sprintController = require("../../controllers/Sprint/sprint.controller");
const express = require("express");
const router = express.Router();
router
  .route("/project/:projectId/sprints")
  .post(sprintController.createSprint)
  .get(sprintController.getAllSprints);
router
  .route("/sprints/:id")
  .get(sprintController.getSprintById)
  .patch(sprintController.updateSprintById)
  .delete(sprintController.deleteSprintById);
module.exports = router;
