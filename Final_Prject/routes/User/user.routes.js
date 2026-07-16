const authController = require("../../controllers/auth.controller.js");
const protect = require("../../middleware/auth.middleware.js");
const userController = require("../../controllers/User/user.controller.js");
const upload = require("../../middleware/multer.middleware.js");
const express = require("express");
const router = express.Router();

// public routes
router.route("/signup").post(authController.signUp);
router.route("/signin").post(authController.signIn);

// protected routes (auth handled globally in app.js)
router.use(protect);
router
  .route("/me")
  .get(userController.getMe)
  .patch(
    (req, res, next) => {
      req.uploadFolder = ""; // used by asyncWrapper to clean up this file if update fails
      next();
    },
    upload.single("userImage"),
    userController.updateMe,
  );

router.route("/updatepassword").patch(userController.updatePassword);

module.exports = router;
