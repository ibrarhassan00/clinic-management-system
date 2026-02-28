const mongoose = require('mongoose');

const diagnosisLogSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: [String],
  age: Number,
  gender: String,
  history: String,
  aiResponse: {
    conditions: [{ name: String, probability: String, description: String }],
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
    suggestedTests: [String],
    advice: String,
  },
  riskFlags: [String],
}, { timestamps: true });

module.exports = mongoose.model('DiagnosisLog', diagnosisLogSchema);