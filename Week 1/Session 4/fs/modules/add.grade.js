const fs = require("fs");
const path = require("path");
const saveGrades = require("./save.grades");

const gradesPath = path.join(__dirname, "..", "data", "grades.json");

function addGrade(name, subject, grade) {
  const data = fs.readFileSync(gradesPath, "utf8");
  const grades = JSON.parse(data);

  const newGrade = {
    id: grades.length > 0 ? grades[grades.length - 1].id + 1 : 1,
    name: name,
    subject: subject,
    grade: grade,
  };

  grades.push(newGrade);
  saveGrades(grades);

  console.log("Grade added successfully.");
}

module.exports = addGrade;
