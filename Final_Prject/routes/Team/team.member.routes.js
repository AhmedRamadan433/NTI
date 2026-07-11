const express = require("express");
const teamMemberController = require("../../controllers/Team/team.member.controller.js");
const protect = require("../../middleware/auth.middleware.js");
const isAdminOrOwner = require("../../middleware/Team/isAdminOrOwner.js");

const router = express.Router();

router.use(protect);

// Get team members and add a member (workspace owner/admin only).
router
  .route("/team/:teamId/members")
  .get(teamMemberController.getMembersOfTeam)
  .post(isAdminOrOwner, teamMemberController.addMemberToTeam)
  .delete(isAdminOrOwner, teamMemberController.removeMemberFromTeam);

// Change the team leader (workspace owner/admin only).
router
  .route("/team/:teamId/leader")
  .patch(isAdminOrOwner, teamMemberController.changeTeamLeader);

module.exports = router;
