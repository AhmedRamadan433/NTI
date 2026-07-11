const Team = require("../../models/team.model.js");
const User = require("../../models/user.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
/// apperorr(msg,statuscode,httpstatustext[sucess,faill,ERROR])
//// 1. Get Team Members
const getMembersOfTeam = asyncWrapper(async (req, res, next) => {
  const { teamId } = req.params;
  const team = await Team.findById(teamId).populate(
    "members",
    "firstName lastName username email ",
  );
  if (!team) {
    return next(new AppError("Team not found", 404, HttpStatus.FAIL));
  }
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Members of the team",
    data: team.members,
  });
});

//// 2. Add Member To Team
const addMemberToTeam = asyncWrapper(async (req, res, next) => {
  const { teamId } = req.params;
  const { memberId } = req.body;
  const team = await Team.findById(teamId);
  if (!team) {
    return next(new AppError("Team not found", 404, HttpStatus.FAIL));
  }
  ////check if user is exist or not
  const user = await User.exists({ _id: memberId });
  if (!user) {
    return next(new AppError("User not found", 404, HttpStatus.FAIL));
  }

  /// check if the member is already in the team
  if (team.members.includes(memberId)) {
    return next(
      new AppError("Member already in the team", 400, HttpStatus.FAIL),
    );
  }
  /// add member to team
  team.members.push(memberId);
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Member added to the team",
    data: team.members,
  });
});

////// 3. Remove Member From Team
const removeMemberFromTeam = asyncWrapper(async (req, res, next) => {
  const { teamId } = req.params;
  const { memberId } = req.body;
  const team = await Team.findById(teamId);
  if (!team) {
    return next(new AppError("Team not found", 404, HttpStatus.FAIL));
  }
  if (!team.members.includes(memberId)) {
    return next(new AppError("Member not in the team", 400, HttpStatus.FAIL));
  }
  team.members = team.members.filter(
    (id) => id.toString() !== memberId.toString(),
  );
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Member removed from the team",
    data: team.members,
  });
});
//// Change Team Leader
const changeTeamLeader = asyncWrapper(async (req, res, next) => {
  const { teamId } = req.params;
  const { newLeaderId } = req.body;
  const team = await Team.findById(teamId);
  const user = await User.exists({ _id: newLeaderId });
  if (!team) {
    return next(new AppError("Team not found", 404, HttpStatus.FAIL));
  }
  if (!user) {
    return next(new AppError("User not found", 404, HttpStatus.FAIL));
  }
  if (team.leader.toString() === newLeaderId.toString()) {
    return next(
      new AppError("User is already the team leader", 400, HttpStatus.FAIL),
    );
  }
  team.leader = newLeaderId;
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Team leader changed successfully",
    data: team.leader,
  });
});
module.exports = {
  getMembersOfTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  changeTeamLeader,
};
