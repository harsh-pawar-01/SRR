const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Syllabus = require('../models/Syllabus');
const Consultation = require('../models/Consultation');

// --- RECEPTIONIST: Student Admission ---
router.post('/students/admit', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- RECEPTIONIST & STUDENT: Get All / Single Student ---
router.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json({ success: true, data: students });
});

router.get('/students/:username', async (req, res) => {
  const student = await Student.findOne({ username: req.params.username });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
});

// --- RECEPTIONIST: Update Marks ---
router.post('/students/marks', async (req, res) => {
  const { studentId, testName, subject, marksObtained, totalMarks } = req.body;
  const student = await Student.findById(studentId);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  student.marks.push({ testName, subject, marksObtained, totalMarks });
  await student.save();
  res.json({ success: true, message: 'Marks updated successfully' });
});

// --- RECEPTIONIST: Update Daily Attendance ---
router.post('/students/attendance', async (req, res) => {
  const { date, attendanceList } = req.body; // attendanceList = [{ studentId, status }]
  
  for (let record of attendanceList) {
    const student = await Student.findById(record.studentId);
    if (student) {
      const idx = student.attendance.findIndex(a => a.date === date);
      if (idx > -1) {
        student.attendance[idx].status = record.status;
      } else {
        student.attendance.push({ date, status: record.status });
      }
      await student.save();
    }
  }
  res.json({ success: true, message: 'Attendance marked successfully' });
});

// --- RECEPTIONIST: 11th to 12th Swap (Bulk Copy/Upgrade) ---
router.post('/students/swap-11-to-12', async (req, res) => {
  try {
    const { studentIds } = req.body; // Array of student _id
    const updated = await Student.updateMany(
      { _id: { $in: studentIds }, classGrade: '11th' },       {$set: { classGrade: '12th' } }
    );
    res.json({ success: true, message: `Successfully upgraded students to 12th standard`, count: updated.modifiedCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- TEACHER: Add Completed Chapter ---
router.post('/syllabus/complete', async (req, res) => {
  try {
    const item = await Syllabus.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- TEACHER: Remove Chapter (Delete wrongly inserted) ---
router.delete('/syllabus/:id', async (req, res) => {
  try {
    await Syllabus.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Chapter removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- STUDENT & TEACHER: View Completed Syllabus ---
router.get('/syllabus/:classGrade', async (req, res) => {
  const chapters = await Syllabus.find({ classGrade: req.params.classGrade });
  res.json({ success: true, data: chapters });
});

// --- CONSULTATION: Submit & View ---
router.post('/consultation', async (req, res) => {
  try {
    const data = await Consultation.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/consultations', async (req, res) => {
  const leads = await Consultation.find().sort({ submittedAt: -1 });
  res.json({ success: true, data: leads });
});

module.exports = router;