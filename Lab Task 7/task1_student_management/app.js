const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Routes
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const attendanceRoutes = require('./routes/attendance');
const marksRoutes = require('./routes/marks');

app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Student Management System API',
    version: '1.0.0',
    endpoints: {
      students: '/api/students',
      teachers: '/api/teachers',
      attendance: '/api/attendance',
      marks: '/api/marks',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Student Management System running on http://localhost:${PORT}`);
});

module.exports = app;
