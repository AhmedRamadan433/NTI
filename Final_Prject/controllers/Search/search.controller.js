const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const Task = require("../../models/task.model.js");
const Workspace = require("../../models/workspace.model.js");
const Team = require("../../models/team.model.js");
const User = require("../../models/user.model.js");
const Project = require("../../models/project.model.js");

////1 serach tasks
const searchTasks = asyncWrapper(async (req, res, next) => {
  const { query } = req.query;
  const { projectId } = req.params;

  if (!query?.trim()) {
    return next(new AppError("Search query is required", 400, HttpStatus.FAIL));
  }

  const project = await Project.exists({ _id: projectId });

  if (!project) {
    return next(new AppError("Project not found", 404, HttpStatus.FAIL));
  }

  const tasks = await Task.find({
    project: projectId,
    isArchived: false,
    $or: [
      {
        name: {
          $regex: query.trim(),
          $options: "i",
        },
      },
      {
        description: {
          $regex: query.trim(),
          $options: "i",
        },
      },
    ],
  })
    .populate("assignedTo", "username email")
    .populate("project", "name");

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    results: tasks.length,
    data: tasks,
  });
});
////// 2. Search Projects
const searchProjects = asyncWrapper(async (req, res, next) => {
  const { query } = req.query;
  const { workspaceId } = req.params;

  if (!query?.trim()) {
    return next(new AppError("Search query is required", 400, HttpStatus.FAIL));
  }
  const workspace = await Workspace.exists({ _id: workspaceId });

  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }
  const projects = await Project.find({
    workspace: workspaceId,
    isArchived: false,
    $or: [
      {
        projectName: {
          $regex: query.trim(),
          $options: "i",
        },
      },
      {
        projectDescription: {
          $regex: query.trim(),
          $options: "i",
        },
      },
    ],
  });

  res.status(200).json({
    status: HttpStatus.SUCCESS,
    results: projects.length,
    data: projects,
  });
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    results: projects.length,
    data: projects,
  });
});
////// 3. Search Teams
const searchTeams = asyncWrapper(async (req, res, next) => {
  const { query } = req.query;
  const { workspaceId } = req.params;
  const userId = req.user._id;

  if (!query?.trim()) {
    return next(new AppError("Search query is required", 400, HttpStatus.FAIL));
  }
  const workspace = await Workspace.exists({ _id: workspaceId });

  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }
  const teams = await Team.find({
    workspace: workspaceId,
    $or: [
      {
        name: {
          $regex: query.trim(),
          $options: "i",
        },
      },
      {
        description: {
          $regex: query.trim(),
          $options: "i",
        },
      },
    ],
  });
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    results: teams.length,
    data: teams,
  });
});
//// 4. Search Workspace Members
const searchWorkspaceMembers = asyncWrapper(async (req, res, next) => {
  const { query } = req.query;
  const { workspaceId } = req.params;

  if (!query?.trim()) {
    return next(new AppError("Search query is required", 400, HttpStatus.FAIL));
  }

  const workspace = await Workspace.findById(workspaceId).select("members");

  if (!workspace) {
    return next(new AppError("Workspace not found", 404, HttpStatus.FAIL));
  }

  const memberIds = workspace.members.map((member) => member.user);

  const members = await User.find({
    _id: { $in: memberIds },
    $or: [
      { username: { $regex: query.trim(), $options: "i" } },
      { email: { $regex: query.trim(), $options: "i" } },
      { firstName: { $regex: query.trim(), $options: "i" } },
      { lastName: { $regex: query.trim(), $options: "i" } },
    ],
  }).select("-password ");
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    results: members.length,
    data: members,
  });
});
//////
module.exports = {
  searchTasks,
  searchProjects,
  searchTeams,
  searchWorkspaceMembers,
};
