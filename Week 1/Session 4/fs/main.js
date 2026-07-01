const addGrade = require("./modules/add.grade");
const readGrades = require("./modules/read.grades");
const updateGrade = require("./modules/update.grade");
const deleteGrade = require("./modules/delete.grade");

const command = process.argv[2];

if (command === "add") {
  const name = process.argv[3];
  const subject = process.argv[4];
  const grade = process.argv[5];

  if (!name || !subject || !grade) {
    console.log("Usage: node main.js add <name> <subject> <grade>");
  } else {
    addGrade(name, subject, grade);
  }
} else if (command === "read") {
  readGrades();
} else if (command === "update") {
  const searchValue = process.argv[3];
  const newGrade = process.argv[4];

  if (!searchValue || !newGrade) {
    console.log("Usage: node main.js update <id-or-name> <new-grade>");
  } else {
    updateGrade(searchValue, newGrade);
  }
} else if (command === "delete") {
  const searchValue = process.argv[3];

  if (!searchValue) {
    console.log("Usage: node main.js delete <id-or-name>");
  } else {
    deleteGrade(searchValue);
  }
} else {
  console.log("Student Grades Manager");
  console.log("Commands:");
  console.log("node main.js add <name> <subject> <grade>");
  console.log("node main.js read");
  console.log("node main.js update <id-or-name> <new-grade>");
  console.log("node main.js delete <id-or-name>");
}
