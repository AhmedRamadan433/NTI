const fs = require("fs");
const path = require("path");

const gradesPath = path.join(__dirname, "..", "data", "grades.json");

function readGrades() {
  const data = fs.readFileSync(gradesPath, "utf8");
  const grades = JSON.parse(data);

  if (grades.length === 0) {
    console.log("No grades found.");
    return;
  }

  console.log("Student Grades:");

  grades.forEach((grade) => {
    console.log(
      `ID: ${grade.id}, Name: ${grade.name}, Subject: ${grade.subject}, Grade: ${grade.grade}`,
    );
  });
}

module.exports = readGrades;
