const express = require("express");
const router = express.Router();
const searchController = require("../../controllers/Search/search.controller.js");
const protect = require("../../middleware/auth.middleware.js");

router.use(protect);

router
  .route("/workspace/:workspaceId/search/tasks")
  .get(searchController.searchTasks);

router
  .route("/workspace/:workspaceId/search/projects")
  .get(searchController.searchProjects);

router
  .route("/workspace/:workspaceId/search/teams")
  .get(searchController.searchTeams);

router
  .route("/workspace/:workspaceId/search/members")
  .get(searchController.searchWorkspaceMembers);

module.exports = router;
