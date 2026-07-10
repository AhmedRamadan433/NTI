const Team = require("../../models/team.model");
const Workspace = require("../../models/workspace.model");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");

//// create team on a workspace
const createTeam = asyncWrapper(async (req, res) => {
  const { workspaceId } = req.params;
  const data = req.body;
  const team = await Team.create({
    ...data,
    workspace: workspaceId,
    leader: req.user.id,
  });
  res.status(201).json({ status: HttpStatus.SUCCESS, data: team });
});
/////// get all teams on a workspace
const getAllTeams = asyncWrapper(async (req, res) => {
  const { workspaceId } = req.params;
  const teams = await Team.find({ workspace: workspaceId })
    .populate("leader", "firstName lastName email")
    .populate("members", "firstName lastName email");
  res.status(200).json({ status: HttpStatus.SUCCESS, data: teams });
});
////// get a team by id
const getTeamById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const team = await Team.findById(id)
    .populate("leader", "firstName lastName email")
    .populate("members", "firstName lastName email");
  if (!team) {
    return next(new AppError("Team not found", HttpStatus.FAIL));
  }
  res.status(200).json({ status: HttpStatus.SUCCESS, data: team });
});

////// update a team by id
const updateTeamById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const team = await Team.findByIdAndUpdate(id, data, {
    runValidators: true,
    returnDocument: "after",
  })
    .populate("leader", "firstName lastName email")
    .populate("members", "firstName lastName email");
  if (!team) {
    return next(new AppError("Team not found", HttpStatus.FAIL));
  }
  res.status(200).json({ status: HttpStatus.SUCCESS, data: team });
});
/// delete a team by id
const deleteTeamById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const team = await Team.findByIdAndDelete(id);
  if (!team) {
    return next(new AppError("Team not found", HttpStatus.FAIL));
  }
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    data: null,
    message: "Team deleted SUCCESSfully",
  });
});
module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeamById,
  deleteTeamById,
};
