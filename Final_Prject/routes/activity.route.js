const express = require("express");
const router = express.Router();
const {
  getWorkspaceActivities,
  getProjectActivities,
  getSprintActivities,
  getTaskActivities,
  getUserActivities,
} = require("../controllers/Activity/activity.controller.js");

router.get("/activities/workspace/:workspaceId", getWorkspaceActivities);
router.get("/activities/project/:projectId", getProjectActivities);
router.get("/activities/sprint/:sprintId", getSprintActivities);
router.get("/activities/task/:taskId", getTaskActivities);
router.get("/activities/user/:userId", getUserActivities);

module.exports = router;
