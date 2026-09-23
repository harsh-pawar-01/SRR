const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  parentName: { type: String, required: true },
  admissionYear: { type: String, required: true },
  stream: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  message: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consultation', consultationSchema);