const express = require("express");
const router = express.Router();
const labelController = require("../../controllers/Label/label.controller.js");

router
  .route("/workspace/:workspaceId/label")
  .post(labelController.createLabel)
  .get(labelController.getAllLabels);

router
  .route("/label/:id")
  .get(labelController.getLabelById)
  .patch(labelController.updateLabelById)
  .delete(labelController.deleteLabelById);

module.exports = router;
