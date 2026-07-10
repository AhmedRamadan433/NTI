const teamcontroller = require("../../controllers/Team/team.controller");
const protect = require("../../middleware/auth.middleware.js");
const isAdminOrOwner = require("../../middleware/Team/isAdminOrOwner.js");
const express = require("express");
const router = express.Router();
router.use(protect);
router
  .route("/workspace/:workspaceId/team")
  .post(teamcontroller.createTeam)
  .get(teamcontroller.getAllTeams);
router
  .route("/team/:id")
  .get(teamcontroller.getTeamById)
  .put(isAdminOrOwner, teamcontroller.updateTeamById)
  .delete(isAdminOrOwner, teamcontroller.deleteTeamById);
module.exports = router;
