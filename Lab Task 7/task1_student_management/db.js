// In-Memory Database
const db = {
  students: [
    { id: 1, name: 'Alice Johnson', email: 'alice@school.com', age: 20, course: 'BSCS' },
    { id: 2, name: 'Bob Smith', email: 'bob@school.com', age: 21, course: 'BSIT' },
  ],
  teachers: [
    { id: 1, name: 'Dr. Sarah Khan', email: 'sarah@school.com', subject: 'Mathematics', qualification: 'PhD' },
    { id: 2, name: 'Mr. James Lee', email: 'james@school.com', subject: 'Physics', qualification: 'MSc' },
  ],
  attendance: [
    { id: 1, studentId: 1, date: '2024-01-15', status: 'Present', subject: 'Mathematics' },
    { id: 2, studentId: 2, date: '2024-01-15', status: 'Absent', subject: 'Physics' },
  ],
  marks: [
    { id: 1, studentId: 1, subject: 'Mathematics', marks: 85, totalMarks: 100, grade: 'B+' },
    { id: 2, studentId: 2, subject: 'Physics', marks: 92, totalMarks: 100, grade: 'A' },
  ],
  counters: {
    students: 3,
    teachers: 3,
    attendance: 3,
    marks: 3,
  },
};

module.exports = db;
