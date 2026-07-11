const Task = require("../../models/task.model.js");
const Sprint = require("../../models/sprint.model.js");
const User = require("../../models/user.model.js");
const Project = require("../../models/project.model.js");
const asyncWrapper = require("../Async_wrapper.js");
const AppError = require("../../utils/AppError.js");
const HttpStatus = require("../../utils/HttpStatusText.js");
const ActivityService = require("../../services/activity.service");
const ActivityActions = require("../../utils/activityActions");

const getTaskActivityScope = async (task) => {
  const projectId = task.project._id || task.project;
  const sprintId = task.sprint?._id || task.sprint || null;
  const project = await Project.findById(projectId).select("workspace");

  return {
    workspace: project?.workspace,
    project: projectId,
    sprint: sprintId,
    task: task._id,
  };
};

//// Assign User To Task
const assignUserToTask = asyncWrapper(async (req, res, next) => {
  const { taskId } = req.params;
  const { userId } = req.body;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }
  const user = await User.exists({ _id: userId });
  if (!user) {
    return next(new AppError("User not found", 404, HttpStatus.FAIL));
  }
  task.assignedTo.push(user._id);
  await task.save();
  const scope = await getTaskActivityScope(task);
  await ActivityService.log({
    action: ActivityActions.TASK_ASSIGNED,
    actor: req.user.id,
    ...scope,
    entityType: "task",
    entityId: task._id,
    ...(String(user._id) !== String(req.user.id) && { targetUser: user._id }),
  });
  res.status(200).json({ status: HttpStatus.SUCCESS, data: task });
});

///// 2 Unassign User From Task
const unassignUserFromTask = asyncWrapper(async (req, res, next) => {
  const { taskId } = req.params;
  const { userId } = req.body;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }
  const user = await User.exists({ _id: userId });
  if (!user) {
    return next(new AppError("User not found", 404, HttpStatus.FAIL));
  }
  task.assignedTo = task.assignedTo.filter((id) => id.toString() !== userId);
  await task.save();
  const scope = await getTaskActivityScope(task);
  await ActivityService.log({
    action: ActivityActions.TASK_UNASSIGNED,
    actor: req.user.id,
    ...scope,
    entityType: "task",
    entityId: task._id,
    ...(String(user._id) !== String(req.user.id) && { targetUser: user._id }),
  });
  res.status(200).json({ status: HttpStatus.SUCCESS, data: task });
});

//// 3 Change Task Status
const changeTaskStatus = asyncWrapper(async (req, res, next) => {
  const taskId = req.params.taskId;
  const { status } = req.body;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }
  if (status !== "To_Do" && status !== "In_Progress" && status !== "Done") {
    return next(new AppError("Invalid task status", 400, HttpStatus.FAIL));
  }
  if (task.status === status) {
    return next(
      new AppError(
        "Task is already in the specified status",
        400,
        HttpStatus.FAIL,
      ),
    );
  }
  const previousStatus = task.status;
  task.status = status;
  await task.save();
  const scope = await getTaskActivityScope(task);
  await ActivityService.log({
    action: ActivityActions.TASK_STATUS_CHANGED,
    actor: req.user.id,
    ...scope,
    entityType: "task",
    entityId: task._id,
    before: { status: previousStatus },
    after: { status },
  });
  res.status(200).json({ status: HttpStatus.SUCCESS, data: task });
});

////// Change Task Priority
const changeTaskPriority = asyncWrapper(async (req, res, next) => {
  const taskId = req.params.taskId;
  const { priority } = req.body;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }
  if (!["low", "medium", "high", "urgent"].includes(priority)) {
    return next(new AppError("Invalid task priority", 400, HttpStatus.FAIL));
  }
  if (task.priority === priority) {
    return next(
      new AppError(
        "Task is already in the specified priority",
        400,
        HttpStatus.FAIL,
      ),
    );
  }
  const previousPriority = task.priority;
  task.priority = priority;
  await task.save();
  const scope = await getTaskActivityScope(task);
  await ActivityService.log({
    action: ActivityActions.TASK_PRIORITY_CHANGED,
    actor: req.user.id,
    ...scope,
    entityType: "task",
    entityId: task._id,
    before: { priority: previousPriority },
    after: { priority },
  });
  res.status(200).json({ status: HttpStatus.SUCCESS, data: task });
});

////// 5 Move Task To Sprint
const moveTaskToSprint = asyncWrapper(async (req, res, next) => {
  const taskId = req.params.taskId;
  const { sprintId } = req.body;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }
  const sprint = await Sprint.exists({ _id: sprintId });
  if (!sprint) {
    return next(new AppError("Sprint not found", 404, HttpStatus.FAIL));
  }
  const previousSprint = task.sprint;
  task.sprint = sprintId;
  await task.save();
  const scope = await getTaskActivityScope(task);
  await ActivityService.log({
    action: ActivityActions.TASK_MOVED_TO_SPRINT,
    actor: req.user.id,
    ...scope,
    entityType: "task",
    entityId: task._id,
    ...(String(previousSprint) !== String(task.sprint) && {
      before: { sprint: previousSprint },
      after: { sprint: task.sprint },
    }),
  });
  res.status(200).json({ status: HttpStatus.SUCCESS, data: task });
});
//// Move Task To Backlog
const moveTaskToBacklog = asyncWrapper(async (req, res, next) => {
  const taskId = req.params.taskId;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError("Task not found", 404, HttpStatus.FAIL));
  }
  const previousSprint = task.sprint;
  task.sprint = null;
  await task.save();
  const scope = await getTaskActivityScope(task);
  await ActivityService.log({
    action: ActivityActions.TASK_MOVED_TO_BACKLOG,
    actor: req.user.id,
    ...scope,
    entityType: "task",
    entityId: task._id,
    ...(previousSprint && {
      before: { sprint: previousSprint },
      after: { sprint: null },
    }),
  });
  res.status(200).json({ status: HttpStatus.SUCCESS, data: task });
});
module.exports = {
  assignUserToTask,
  unassignUserFromTask,
  changeTaskStatus,
  changeTaskPriority,
  moveTaskToSprint,
  moveTaskToBacklog,
};
