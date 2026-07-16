const workspaceController = require("../../controllers/WorksSpace/workspace.controller");
const express = require("express");
const router = express.Router();
const protect = require("../../middleware/auth.middleware.js");
const upload = require("../../middleware/multer.middleware.js");
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
  .patch(
    isOwner,
    (req, res, next) => {
      req.uploadFolder = ""; // used by asyncWrapper to clean up this file if update fails
      next();
    },
    upload.single("avatar"),
    workspaceController.updateWorkspace,
  )
  .delete(isOwner, workspaceController.deleteWorkspace);

module.exports = router;
