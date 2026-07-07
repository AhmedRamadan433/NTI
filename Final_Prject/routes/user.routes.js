const authController = require("../controllers/auth.controller.js");
const express = require("express");
const router = express.Router();
router.route("/signup").post(authController.signUp);
router.route("/signin").post(authController.signIn);
module.exports = router;
