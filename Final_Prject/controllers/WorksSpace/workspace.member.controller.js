const Workspace = require("../../models/workspace.model");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const WorkspaceInvitation = require("../../models/WorkspaceInvitation.js");
const crypto = require("crypto");
const ActivityService = require("../../services/activity.service");
const ActivityActions = require("../../utils/activityActions");
//// 1 get members of workspace
const getMembersOfWorkspace = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const workspace = await Workspace.findById(id).populate(
    "members.user",
    "firstName lastName username email",
  );
  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }
  res.status(200).send({ status: HttpStatus.SUCCESS, data: workspace.members });
});

///////  2 remove member from workspace
const removeMemberFromWorkspace = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;
  const { memberId } = req.body;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }
  if (workspace.owner.toString() === req.user._id.toString()) {
    return next(
      new AppError("only owner can remove members", 400, HttpStatus.FAIL),
    );
  }
  if (workspace.owner.toString() === memberId) {
    return next(
      new AppError("Cannot remove the workspace owner", 400, HttpStatus.FAIL),
    );
  }
  const memberIndex = workspace.members.findIndex(
    (member) => member.user._id.toString() === memberId,
  );
  if (memberIndex === -1) {
    return next(
      new AppError("Member not found in workspace", 404, HttpStatus.FAIL),
    );
  }
  workspace.members.splice(memberIndex, 1);
  await workspace.save();
  await ActivityService.log({
    action: ActivityActions.MEMBER_REMOVED,
    actor: req.user.id,
    workspace: workspace._id,
    entityType: "workspace",
    entityId: workspace._id,
    ...(String(memberId) !== String(req.user.id) && { targetUser: memberId }),
  });
  res.status(200).send({ status: HttpStatus.SUCCESS, data: workspace.members });
});

///// leave workspace
const leaveWorkspace = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;
  const userId = req.user._id;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }
  if (workspace.owner.toString() === userId.toString()) {
    return next(
      new AppError("Owner cannot leave the workspace", 400, HttpStatus.FAIL),
    );
  }
  workspace.members = workspace.members.filter(
    (member) => member.user.toString() !== userId.toString(),
  );
  await workspace.save();
  await ActivityService.log({
    action: ActivityActions.MEMBER_LEFT,
    actor: req.user.id,
    workspace: workspace._id,
    entityType: "workspace",
    entityId: workspace._id,
  });
  res.status(200).send({ status: HttpStatus.SUCCESS, data: workspace.members });
});
///////////change member role in workspace
const changeMemberRoleInWorkspace = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;
  const { memberId, newRole } = req.body;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }
  //   if (workspace.owner.toString() === memberId) {
  //     return next(
  //       new AppError(
  //         "Cannot change role of the workspace owner",
  //         400,
  //         HttpStatus.FAIL,
  //       ),
  //     );
  //   }
  const member = workspace.members.id(memberId);
  if (!member) {
    return next(
      new AppError("Member not found in workspace", 404, HttpStatus.FAIL),
    );
  }
  if (newRole !== "admin" && newRole !== "member") {
    return next(new AppError("Invalid role", 400, HttpStatus.FAIL));
  }
  const previousRole = member.role;
  member.role = newRole;
  await workspace.save();
  await ActivityService.log({
    action: ActivityActions.MEMBER_ROLE_CHANGED,
    actor: req.user.id,
    workspace: workspace._id,
    entityType: "workspace",
    entityId: workspace._id,
    ...(String(memberId) !== String(req.user.id) && { targetUser: memberId }),
    ...(previousRole !== newRole && {
      before: { role: previousRole },
      after: { role: newRole },
    }),
  });
  res.status(200).send({ status: HttpStatus.SUCCESS, data: workspace.members });
});
///////// Transfer Ownership
const transferOwnership = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;
  const { newOwnerId } = req.body;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }
  if (workspace.owner.toString() === newOwnerId) {
    return next(
      new AppError(
        "New owner is already the workspace owner",
        400,
        HttpStatus.FAIL,
      ),
    );
  }
  const previousOwner = workspace.owner;
  workspace.owner = newOwnerId;
  await workspace.save();
  await ActivityService.log({
    action: ActivityActions.OWNERSHIP_TRANSFERRED,
    actor: req.user.id,
    workspace: workspace._id,
    entityType: "workspace",
    entityId: workspace._id,
    ...(String(newOwnerId) !== String(req.user.id) && {
      targetUser: newOwnerId,
    }),
    before: { owner: previousOwner },
    after: { owner: newOwnerId },
  });
  res.status(200).send({ status: HttpStatus.SUCCESS, data: workspace });
});
///////// Invite Member
const inviteMember = asyncWrapper(async (req, res, next) => {
  const { workspaceId } = req.params;
  const { recipientId } = req.body;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }
  // Check if the recipient is already a member
  const isAlreadyMember = workspace.members.some(
    (member) => member.user._id === recipientId,
  );
  if (isAlreadyMember) {
    return next(
      new AppError(
        "User is already a member of the workspace",
        400,
        HttpStatus.FAIL,
      ),
    );
  }
  ///// if not a member then create invitation
  const token = crypto.randomBytes(16).toString("hex");
  const invitation = new WorkspaceInvitation({
    workspace: workspaceId,
    sender: req.user._id,
    recipient: recipientId,
    token,
  });
  await invitation.save();
  res.status(200).send({
    status: HttpStatus.SUCCESS,
    message: "Invitation sent successfully",
  });
});

////// Accept Invitation
const acceptInvitation = asyncWrapper(async (req, res, next) => {
  const { token } = req.params;
  const invitation = await WorkspaceInvitation.findOne({ token });
  if (!invitation) {
    return next(new AppError("Invitation not found", 404, HttpStatus.FAIL));
  }
  //// check status of invitation
  if (invitation.status !== "pending") {
    return next(
      new AppError(`Invitation is ${invitation.status}`, 400, HttpStatus.FAIL),
    );
  }
  //// check if invitation is expired
  if (invitation.expiresAt < new Date()) {
    invitation.status = "expired";
    await invitation.save();
    return next(new AppError("Invitation has expired", 400, HttpStatus.FAIL));
  }
  //// check if the user accepting the invitation is the recipient
  if (!invitation.recipient.equals(req.user._id)) {
    return next(
      new AppError(
        "You are not authorized to accept this invitation",
        403,
        HttpStatus.FAIL,
      ),
    );
  }
  ///// add user to workspace members and set status of invitation to accepted
  const workspace = await Workspace.findById(invitation.workspace);
  workspace.members.push({ user: req.user._id, role: "member" });
  await workspace.save();
  invitation.status = "accepted";
  await invitation.save();
  await ActivityService.log({
    action: ActivityActions.MEMBER_JOINED,
    actor: req.user.id,
    workspace: workspace._id,
    entityType: "workspace",
    entityId: workspace._id,
  });
  res.status(200).send({ status: HttpStatus.SUCCESS, data: workspace.members });
});
/////// Reject Invitation
const rejectInvitation = asyncWrapper(async (req, res, next) => {
  const { token } = req.params;
  const invitation = await WorkspaceInvitation.findOne({ token });
  if (!invitation) {
    return next(new AppError("Invitation not found", 404, HttpStatus.FAIL));
  }
  //// decline the invitation
  invitation.status = "declined";
  await invitation.save();
  res
    .status(200)
    .send({ status: HttpStatus.SUCCESS, message: "Invitation declined" });
});
module.exports = {
  getMembersOfWorkspace,
  removeMemberFromWorkspace,
  leaveWorkspace,
  changeMemberRoleInWorkspace,
  transferOwnership,
  inviteMember,
  acceptInvitation,
  rejectInvitation,
};
