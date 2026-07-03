const fs = require("fs");
const path = require("path");

const coursesPath = path.join(__dirname, "..", "data", "data.json");

let courses = JSON.parse(fs.readFileSync(coursesPath, "utf-8"));

const findCourseById = (id) => {
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) {
    return null;
  }

  return courses.find((course) => course.id === courseId);
};

const getAllCourses = (req, res) => {
  return res.status(200).json({
    status: "success",
    count: courses.length,
    data: {
      courses,
    },
  });
};

const getCourseById = (req, res) => {
  const course = findCourseById(req.params.id);

  if (!course) {
    return res.status(404).json({
      status: "error",
      message: "Course not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
};

const createCourse = (req, res) => {
  const lastCourse = courses[courses.length - 1];
  const newId = lastCourse ? lastCourse.id + 1 : 1;

  const newCourse = {
    id: newId,
    ...req.body,
  };

  courses.push(newCourse);

  fs.writeFile(coursesPath, JSON.stringify(courses, null, 2), () => {
    return res.status(201).json({
      status: "success",
      message: "New course added",
      data: {
        course: newCourse,
      },
    });
  });
};

const updateCourse = (req, res) => {
  const course = findCourseById(req.params.id);

  if (!course) {
    return res.status(404).json({
      status: "error",
      message: "Course not found",
    });
  }

  const index = courses.findIndex((item) => item.id === course.id);
  const updatedCourse = Object.assign(course, req.body);

  courses[index] = updatedCourse;

  fs.writeFile(coursesPath, JSON.stringify(courses, null, 2), () => {
    return res.status(200).json({
      status: "success",
      message: "Course updated successfully",
      data: {
        course: updatedCourse,
      },
    });
  });
};

const deleteCourse = (req, res) => {
  const course = findCourseById(req.params.id);

  if (!course) {
    return res.status(404).json({
      status: "error",
      message: "Course not found",
    });
  }

  const index = courses.findIndex((item) => item.id === course.id);
  courses.splice(index, 1);

  fs.writeFile(coursesPath, JSON.stringify(courses, null, 2), () => {
    return res.status(200).json({
      status: "success",
      message: "Course deleted successfully",
      data: {
        course,
      },
    });
  });
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
