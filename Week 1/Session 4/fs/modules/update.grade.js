const fs = require("fs");
const path = require("path");
const saveGrades = require("./save.grades");

const gradesPath = path.join(__dirname, "..", "data", "grades.json");

function updateGrade(searchValue, newGrade) {
  const data = fs.readFileSync(gradesPath, "utf8");
  const grades = JSON.parse(data);
  let found = false;

  const record = grades.find(
    (grade) => grade.id == searchValue || grade.name == searchValue,
  );

  if (!record) {
    console.log("Grade record not found.");
    return;
  }

  record.grade = newGrade;
  saveGrades(grades);
  console.log("Grade updated successfully.");
}

module.exports = updateGrade;
