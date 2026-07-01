const fs = require("fs");
const path = require("path");
const saveGrades = require("./save.grades");

const gradesPath = path.join(__dirname, "..", "data", "grades.json");

function deleteGrade(searchValue) {
  const data = fs.readFileSync(gradesPath, "utf8");
  const grades = JSON.parse(data);

  const newGrades = grades.filter(
    (grade) => grade.id != searchValue && grade.name != searchValue,
  );

  if (newGrades.length === grades.length) {
    console.log("Grade record not found.");
    return;
  }

  saveGrades(newGrades);
  console.log("Grade deleted successfully.");
}

module.exports = deleteGrade;
