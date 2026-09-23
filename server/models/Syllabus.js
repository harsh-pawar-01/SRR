const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  classGrade: { type: String, enum: ['11th', '12th'], required: true },
  subject: { type: String, required: true }, // Physics, Chemistry, Math, Biology
  chapterName: { type: String, required: true },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Syllabus', syllabusSchema);