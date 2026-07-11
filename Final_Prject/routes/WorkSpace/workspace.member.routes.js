const workspaceMemberController = require("../../controllers/WorksSpace/workspace.member.controller");
const express = require("express");
const router = express.Router();
const protect = require("../../middleware/auth.middleware.js");
const {
  isOwner,
} = require("../../middleware/WorkSpace/workspace.middleware.js");

router.use(protect);

// Get all members of a workspace
router
  .route("/workspace/:workspaceId/members")
  .get(workspaceMemberController.getMembersOfWorkspace);

// Remove member from workspace (owner only)
router
  .route("/workspace/:workspaceId/members")
  .delete(isOwner, workspaceMemberController.removeMemberFromWorkspace);

// Leave workspace
router
  .route("/workspace/:workspaceId/leave")
  .post(workspaceMemberController.leaveWorkspace);

// Change member role in workspace (owner only)
router
  .route("/workspace/:workspaceId/members/role")
  .patch(isOwner, workspaceMemberController.changeMemberRoleInWorkspace);

// Transfer ownership (owner only)
router
  .route("/workspace/:workspaceId/ownership")
  .patch(isOwner, workspaceMemberController.transferOwnership);

// Invite member to workspace (owner only)
router
  .route("/workspace/:workspaceId/invite")
  .post(isOwner, workspaceMemberController.inviteMember);

// Accept workspace invitation
router
  .route("/invitation/:token/accept")
  .post(workspaceMemberController.acceptInvitation);

// Reject workspace invitation
router
  .route("/invitation/:token/reject")
  .post(workspaceMemberController.rejectInvitation);

module.exports = router;
