const fs = require("fs");
const path = require("path");

const gradesPath = path.join(__dirname, "..", "data", "grades.json");

function saveGrades(grades) {
  const data = JSON.stringify(grades, null, 2);
  fs.writeFileSync(gradesPath, data);
}

module.exports = saveGrades;
