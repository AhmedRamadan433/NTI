class Person {
  #email;
  #id;

  constructor(name, email, id) {
    this.name = name;
    this.email = email;
    this.id = id;
  }

  get email() {
    return this.#email;
  }

  set email(email) {
    if (email.includes("@")) {
      this.#email = email;
    } else {
      console.log("Email is not valid");
    }
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    if (id > 0) {
      this.#id = id;
    } else {
      console.log("ID must be greater than 0");
    }
  }

  describeRole() {
    console.log(`${this.name} is part of the school.`);
  }
}

class Principal extends Person {
  constructor(name, email, id) {
    super(name, email, id);
    this.members = [];
  }

  addMember(person) {
    this.members.push(person);
    console.log(`${person.name} joined the school.`);
  }

  removeMember(id) {
    this.members = this.members.filter((person) => person.id !== id);
  }

  listMembers() {
    console.log("School Members:");
    this.members.forEach((person) => {
      console.log(`${person.name} - ${person.constructor.name}`);
    });
  }

  describeRole() {
    console.log(`${this.name} manages the school.`);
  }
}

class Teacher extends Person {
  constructor(name, email, id, subject) {
    super(name, email, id);
    this.subject = subject;
    this.students = [];
  }

  gradeStudent(studentName, grade) {
    this.students.push({
      name: studentName,
      grade: grade,
    });
  }

  listGradedStudents() {
    console.log(`${this.name}'s Grades:`);
    this.students.forEach((student) => {
      console.log(`${student.name}: ${student.grade}`);
    });
  }

  describeRole() {
    console.log(`${this.name} teaches ${this.subject}.`);
  }
}

class Student extends Person {
  constructor(name, email, id) {
    super(name, email, id);
    this.subjects = [];
  }

  enroll(subject) {
    this.subjects.push(subject);
  }

  viewSubjects() {
    console.log(`${this.name}'s Subjects:`);
    this.subjects.forEach((subject) => {
      console.log(subject);
    });
  }

  describeRole() {
    console.log(`${this.name} is studying at the school.`);
  }
}

const principal = new Principal("Mr. Ahmed", "principal@school.com", 1);
const teacher = new Teacher("Ms. Sara", "sara@school.com", 2, "Math");
const student = new Student("Ali", "ali@school.com", 3);

principal.addMember(teacher);
principal.addMember(student);

principal.listMembers();

teacher.gradeStudent("Ali", 95);
teacher.gradeStudent("Omar", 88);
teacher.listGradedStudents();

student.enroll("Math");
student.enroll("Physics");
student.enroll("English");
student.viewSubjects();

const members = [principal, teacher, student];

members.forEach((person) => {
  person.describeRole();
});
