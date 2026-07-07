const express = require("express");
const router = express.Router();
const PojectRoutes = require("./project_routes");
const UserRoutes = require("./user.routes");
router.use("/users", UserRoutes);
router.use("/projects", PojectRoutes);

module.exports = router;
