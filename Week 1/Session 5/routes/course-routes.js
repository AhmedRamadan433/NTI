const express = require("express");
const courseControllers = require("../controllers/course-controllers");

const router = express.Router();

router
  .route("/")
  .get(courseControllers.getAllCourses)
  .post(courseControllers.createCourse);

router
  .route("/:id")
  .get(courseControllers.getCourseById)
  .patch(courseControllers.updateCourse)
  .delete(courseControllers.deleteCourse);

module.exports = router;
