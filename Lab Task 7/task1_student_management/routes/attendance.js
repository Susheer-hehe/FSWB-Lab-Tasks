const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all attendance records
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: db.attendance.length,
    data: db.attendance,
  });
});

// GET attendance by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const record = db.attendance.find((a) => a.id === id);

  if (!record) {
    return res.status(404).json({ success: false, message: `Attendance record with ID ${id} not found` });
  }

  res.status(200).json({ success: true, data: record });
});

// GET attendance by student ID
router.get('/student/:studentId', (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const records = db.attendance.filter((a) => a.studentId === studentId);

  res.status(200).json({
    success: true,
    count: records.length,
    data: records,
  });
});

// POST create attendance record
router.post('/', (req, res) => {
  const { studentId, date, status, subject } = req.body;

  if (!studentId || !date || !status || !subject) {
    return res.status(400).json({
      success: false,
      message: 'Please provide studentId, date, status (Present/Absent), and subject',
    });
  }

  // Validate status
  if (!['Present', 'Absent', 'Late'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be Present, Absent, or Late',
    });
  }

  // Validate student exists
  const student = db.students.find((s) => s.id === parseInt(studentId));
  if (!student) {
    return res.status(404).json({ success: false, message: `Student with ID ${studentId} not found` });
  }

  const newRecord = {
    id: db.counters.attendance++,
    studentId: parseInt(studentId),
    date,
    status,
    subject,
  };

  db.attendance.push(newRecord);
  res.status(201).json({ success: true, message: 'Attendance recorded successfully', data: newRecord });
});

// PUT update attendance record
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.attendance.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Attendance record with ID ${id} not found` });
  }

  const { studentId, date, status, subject } = req.body;

  if (status && !['Present', 'Absent', 'Late'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be Present, Absent, or Late' });
  }

  const updated = {
    ...db.attendance[index],
    ...(studentId && { studentId: parseInt(studentId) }),
    ...(date && { date }),
    ...(status && { status }),
    ...(subject && { subject }),
  };

  db.attendance[index] = updated;
  res.status(200).json({ success: true, message: 'Attendance updated successfully', data: updated });
});

// DELETE attendance record
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.attendance.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Attendance record with ID ${id} not found` });
  }

  const deleted = db.attendance.splice(index, 1)[0];
  res.status(200).json({ success: true, message: 'Attendance record deleted successfully', data: deleted });
});

module.exports = router;
