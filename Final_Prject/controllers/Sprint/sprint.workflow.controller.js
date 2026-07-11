const Sprint = require("../../models/sprint.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const Task = require("../../models/task.model.js");
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
// Start Sprint
const startSprint = asyncWrapper(async (req, res, next) => {
  const { sprintId } = req.params;
  const sprint = await Sprint.findById(sprintId);
  if (!sprint) {
    return next(new AppError("Sprint not found", 404, HttpStatus.FAIL));
  }
  if (sprint.status !== "planned") {
    return next(new AppError("Sprint cannot be started", 400, HttpStatus.FAIL));
  }
  if (sprint.find({ project: sprint.project, status: "active" }).length > 0) {
    return next(
      new AppError(
        "Another sprint is already active for this project",
        400,
        HttpStatus.FAIL,
      ),
    );
  }
  const previousStatus = sprint.status;
  sprint.status = "active";
  sprint.startDate = new Date();
  sprint.endDate = new Date(
    sprint.startDate.getTime() + 7 * 24 * 60 * 60 * 1000,
  ); // Set end date to 1 week from start date
  await sprint.save();
  const scope = await getSprintActivityScope(sprint);
  await ActivityService.log({
    action: ActivityActions.SPRINT_STARTED,
    actor: req.user.id,
    ...scope,
    entityType: "sprint",
    entityId: sprint._id,
    before: { status: previousStatus },
    after: { status: sprint.status },
  });
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Sprint started successfully",
    data: sprint,
  });
});

////// 2. Complete Sprint
const completeSprint = asyncWrapper(async (req, res, next) => {
  const { sprintId } = req.params;
  const sprint = await Sprint.findById(sprintId);

  if (!sprint) {
    const error = new AppError("Sprint not found", 404, HttpStatus.FAIL);
    return next(error);
  }

  if (sprint.status !== "active") {
    const error = new AppError(
      "Sprint cannot be completed as it is not active",
      400,
      HttpStatus.FAIL,
    );
    return next(error);
  }

  await Task.updateMany(
    {
      sprint: sprintId,
      status: { $ne: "done" },
    },
    {
      $set: { sprint: null },
    },
  );

  const previousStatus = sprint.status;
  sprint.status = "completed";
  sprint.completedAt = new Date();

  await sprint.save();
  const scope = await getSprintActivityScope(sprint);
  await ActivityService.log({
    action: ActivityActions.SPRINT_COMPLETED,
    actor: req.user.id,
    ...scope,
    entityType: "sprint",
    entityId: sprint._id,
    before: { status: previousStatus },
    after: { status: sprint.status },
  });
  res.status(200).json({
    status: HttpStatus.SUCCESS,
    message: "Sprint completed successfully",
    data: sprint,
  });
});

module.exports = {
  startSprint,
  completeSprint,
};
