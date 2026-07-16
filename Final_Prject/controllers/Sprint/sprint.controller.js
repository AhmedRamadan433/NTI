const Sprint = require("../../models/sprint.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const Project = require("../../models/project.model.js");
const ActivityService = require("../../services/activity.service");
const ActivityActions = require("../../utils/activityActions");

const getSprintActivityScope = async (sprint) => {
  const project = await Project.findById(sprint.project).select("workspace");

  return {
    workspace: project?.workspace,
    project: sprint.project,
    sprint: sprint._id,
  };
};

/// create sprint
const createSprint = asyncWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const data = req.body;
  const sprint = await Sprint.create({
    ...data,
    project: projectId,
  });
  if (!sprint) {
    return next(new AppError("Sprint creation failed", 400, HttpStatus.FAIL));
  }
  const scope = await getSprintActivityScope(sprint);
  await ActivityService.log({
    action: ActivityActions.SPRINT_CREATED,
    actor: req.user.id,
    ...scope,
    entityType: "sprint",
    entityId: sprint._id,
  });
  res.status(201).json({ status: HttpStatus.SUCCESS, data: sprint });
});

///// get all sprints for a project
const getAllSprints = asyncWrapper(async (req, res, next) => {
  const { projectId } = req.params;
  const sprints = await Sprint.find({ project: projectId });
  if (!sprints) {
    return next(
      new AppError("No sprints found for this project", 404, HttpStatus.FAIL),
    );
  }
  res.status(200).json({ status: HttpStatus.SUCCESS, data: sprints });
});

////// get a sprint by id
const getSprintById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const sprint = await Sprint.findById(id);
  if (!sprint) {
    return next(new AppError("Sprint not found", 404, HttpStatus.FAIL));
  }
  res.status(200).json({ status: HttpStatus.SUCCESS, data: sprint });
});
////// update a sprint by id
const updateSprintById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const existing = await Sprint.findById(id);
  if (!existing) {
    return next(new AppError("Sprint not found", 404, HttpStatus.FAIL));
  }

  const newStart = data.startDate
    ? new Date(data.startDate)
    : existing.startDate;
  const newEnd = data.endDate ? new Date(data.endDate) : existing.endDate;

  if (newEnd <= newStart) {
    return next(
      new AppError("End date must be after start date", 400, HttpStatus.FAIL),
    );
  }

  const sprint = await Sprint.findByIdAndUpdate(id, data, {
    runValidators: true,
    returnDocument: "after",
  });

  res.status(200).json({ status: HttpStatus.SUCCESS, data: sprint });
});

///// delete a sprint by id
const deleteSprintById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const sprint = await Sprint.findByIdAndDelete(id);
  if (!sprint) {
    return next(new AppError("Sprint not found", 404, HttpStatus.FAIL));
  }
  res.status(200).json({ status: HttpStatus.SUCCESS, data: sprint });
});

module.exports = {
  createSprint,
  getAllSprints,
  getSprintById,
  updateSprintById,
  deleteSprintById,
};
