function hospitalTriage(patients) {
  let treatedImmediately = [];
  let normalTreated = [];
  let missingDataList = [];

  for (let patient of patients) {
    if (!patient.hasData) {
      missingDataList.push(patient);
      continue;
    }

    if (patient.condition === "critical") {
      treatedImmediately.push(patient);
    } else {
      normalTreated.push(patient);
    }
  }

  normalTreated.sort((a, b) => b.severity - a.severity);

  return {
    treatedImmediately,
    normalTreated,
    missingDataList,
  };
}
/// examples
const patients = [
  {
    name: "John",
    severity: 2,
    hasData: true,
    condition: "normal",
  },
  {
    name: "Emma",
    severity: 5,
    hasData: true,
    condition: "critical",
  },
  {
    name: "Michael",
    severity: 4,
    hasData: false,
    condition: "normal",
  },
  {
    name: "Sophia",
    severity: 3,
    hasData: true,
    condition: "normal",
  },
  {
    name: "David",
    severity: 1,
    hasData: true,
    condition: "critical",
  },
];

console.log(hospitalTriage(patients));
