const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bloodGroup: String,
  phone: String,
  address: String,
  medicalHistory: [{ condition: String, note: String, date: Date }],
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // receptionist
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);