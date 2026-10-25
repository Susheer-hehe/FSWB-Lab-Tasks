const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all teachers
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: db.teachers.length,
    data: db.teachers,
  });
});

// GET single teacher by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const teacher = db.teachers.find((t) => t.id === id);

  if (!teacher) {
    return res.status(404).json({ success: false, message: `Teacher with ID ${id} not found` });
  }

  res.status(200).json({ success: true, data: teacher });
});

// POST create new teacher
router.post('/', (req, res) => {
  const { name, email, subject, qualification } = req.body;

  if (!name || !email || !subject || !qualification) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, subject, and qualification',
    });
  }

  const exists = db.teachers.find((t) => t.email === email);
  if (exists) {
    return res.status(409).json({ success: false, message: 'Teacher with this email already exists' });
  }

  const newTeacher = {
    id: db.counters.teachers++,
    name,
    email,
    subject,
    qualification,
  };

  db.teachers.push(newTeacher);
  res.status(201).json({ success: true, message: 'Teacher created successfully', data: newTeacher });
});

// PUT update teacher by ID
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.teachers.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Teacher with ID ${id} not found` });
  }

  const { name, email, subject, qualification } = req.body;
  const updated = {
    ...db.teachers[index],
    ...(name && { name }),
    ...(email && { email }),
    ...(subject && { subject }),
    ...(qualification && { qualification }),
  };

  db.teachers[index] = updated;
  res.status(200).json({ success: true, message: 'Teacher updated successfully', data: updated });
});

// DELETE teacher by ID
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = db.teachers.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Teacher with ID ${id} not found` });
  }

  const deleted = db.teachers.splice(index, 1)[0];
  res.status(200).json({ success: true, message: 'Teacher deleted successfully', data: deleted });
});

module.exports = router;
