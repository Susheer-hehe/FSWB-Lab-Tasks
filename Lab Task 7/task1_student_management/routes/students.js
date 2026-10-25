const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all students
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: db.students.length,
    data: db.students,
  });
});

// GET single student by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = db.students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ success: false, message: `Student with ID ${id} not found` });
  }

  res.status(200).json({ success: true, data: student });
});

// POST create new student
router.post('/', (req, res) => {
  const { name, email, age, course } = req.body;

  if (!name || !email || !age || !course) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, age, and course' });
  }

  // Check duplicate email
  const exists = db.students.find((s) => s.email === email);
  if (exists) {
    return res.status(409).json({ success: false, message: 'Student with this email already exists' });
  }

  const newStudent = {
    id: db.counters.students++,
    name,
    email,
    age: parseInt(age),
    course,
  };

  db.students.push(newStudent);
  res.status(201).json({ success: true, message: 'Student created successfully', data: newStudent });
});

// PUT update student by ID
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Student with ID ${id} not found` });
  }

  const { name, email, age, course } = req.body;
  const updated = {
    ...db.students[index],
    ...(name && { name }),
    ...(email && { email }),
    ...(age && { age: parseInt(age) }),
    ...(course && { course }),
  };

  db.students[index] = updated;
  res.status(200).json({ success: true, message: 'Student updated successfully', data: updated });
});

// DELETE student by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Student with ID ${id} not found` });
  }

  const deleted = db.students.splice(index, 1)[0];
  res.status(200).json({ success: true, message: 'Student deleted successfully', data: deleted });
});

module.exports = router;
