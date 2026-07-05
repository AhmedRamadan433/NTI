const express = require("express");
const router = express.Router();
const PojectRoutes = require("./project_routes");

router.use("/projects", PojectRoutes);

module.exports = router;
