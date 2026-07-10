const workspaceController = require("../../controllers/WorksSpace/workspace.controller");
const express = require("express");
const router = express.Router();
const protect = require("../../middleware/auth.middleware.js");
const {
  isOwner,
} = require("../../middleware/WorkSpace/workspace.middleware.js");
router.use(protect);
router
  .route("/")
  .post(workspaceController.createWorkspace)
  .get(workspaceController.getAllWorkspaces);
router
  .route("/:id")
  .get(workspaceController.getWorkspaceById)
  .patch(isOwner, workspaceController.updateWorkspace)
  .delete(isOwner, workspaceController.deleteWorkspace);
module.exports = router;
