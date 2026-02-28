const Patient = require('../models/Patient');
const User = require('../models/User');

// Register new patient
const registerPatient = async (req, res) => {
  const { name, age, gender, bloodGroup, phone, address } = req.body;
  const patient = await Patient.create({
    name, age, gender, bloodGroup, phone, address,
    registeredBy: req.user._id,
  });
  res.status(201).json(patient);
};

// Get all patients
const getAllPatients = async (req, res) => {
  const patients = await Patient.find().populate('registeredBy', 'name');
  res.json(patients);
};

// Update patient info
const updatePatient = async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
};

// Get all doctors (for booking)
const getDoctors = async (req, res) => {
  const doctors = await User.find({ role: 'doctor', isActive: true }).select('name specialization');
  res.json(doctors);
};

module.exports = { registerPatient, getAllPatients, updatePatient, getDoctors };