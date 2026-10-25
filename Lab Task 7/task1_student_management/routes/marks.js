const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to calculate grade
const calculateGrade = (marks, totalMarks) => {
  const percentage = (marks / totalMarks) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

// GET all marks
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: db.marks.length,
    data: db.marks,
  });
});

// GET marks by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const record = db.marks.find((m) => m.id === id);

  if (!record) {
    return res.status(404).json({ success: false, message: `Marks record with ID ${id} not found` });
  }

  res.status(200).json({ success: true, data: record });
});

// GET marks by student ID
router.get('/student/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const records = db.marks.filter((m) => m.studentId === studentId);

  const totalObtained = records.reduce((sum, r) => sum + r.marks, 0);
  const totalPossible = records.reduce((sum, r) => sum + r.totalMarks, 0);
  const overallPercentage = totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    count: records.length,
    summary: { totalObtained, totalPossible, overallPercentage: `${overallPercentage}%` },
    data: records,
  });
});

// POST add marks
router.post('/', (req, res) => {
  const { studentId, subject, marks, totalMarks } = req.body;

  if (!studentId || !subject || marks === undefined || !totalMarks) {
    return res.status(400).json({
      success: false,
      message: 'Please provide studentId, subject, marks, and totalMarks',
    });
  }

  if (parseInt(marks) > parseInt(totalMarks)) {
    return res.status(400).json({ success: false, message: 'Marks cannot exceed totalMarks' });
  }

  // Validate student exists
  const student = db.students.find((s) => s.id === parseInt(studentId));
  if (!student) {
    return res.status(404).json({ success: false, message: `Student with ID ${studentId} not found` });
  }

  const newRecord = {
    id: db.counters.marks++,
    studentId: parseInt(studentId),
    subject,
    marks: parseInt(marks),
    totalMarks: parseInt(totalMarks),
    grade: calculateGrade(parseInt(marks), parseInt(totalMarks)),
  };

  db.marks.push(newRecord);
  res.status(201).json({ success: true, message: 'Marks added successfully', data: newRecord });
});

// PUT update marks
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.marks.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Marks record with ID ${id} not found` });
  }

  const { studentId, subject, marks, totalMarks } = req.body;

  const updatedMarks = marks !== undefined ? parseInt(marks) : db.marks[index].marks;
  const updatedTotal = totalMarks !== undefined ? parseInt(totalMarks) : db.marks[index].totalMarks;

  if (updatedMarks > updatedTotal) {
    return res.status(400).json({ success: false, message: 'Marks cannot exceed totalMarks' });
  }

  const updated = {
    ...db.marks[index],
    ...(studentId && { studentId: parseInt(studentId) }),
    ...(subject && { subject }),
    marks: updatedMarks,
    totalMarks: updatedTotal,
    grade: calculateGrade(updatedMarks, updatedTotal),
  };

  db.marks[index] = updated;
  res.status(200).json({ success: true, message: 'Marks updated successfully', data: updated });
});

// DELETE marks record
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.marks.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Marks record with ID ${id} not found` });
  }

  const deleted = db.marks.splice(index, 1)[0];
  res.status(200).json({ success: true, message: 'Marks record deleted successfully', data: deleted });
});

module.exports = router;
