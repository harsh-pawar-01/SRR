const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNo: { type: String, required: true },
  parentName: { type: String, required: true },
  parentMobNo: { type: String, required: true },
  address: { type: String, required: true },
  collegeName: { type: String, required: true },
  classGrade: { type: String, enum: ['11th', '12th'], default: '11th' },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admissionDate: { type: Date, default: Date.now },
  marks: [
    {
      testName: String,
      subject: String,
      marksObtained: Number,
      totalMarks: Number,
      date: { type: Date, default: Date.now }
    }
  ],
  attendance: [
    {
      date: { type: String, required: true }, // Format: YYYY-MM-DD
      status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema);