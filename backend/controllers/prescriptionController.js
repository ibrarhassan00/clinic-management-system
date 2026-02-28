const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { generatePrescriptionPDF } = require('../utils/pdfGenerator');

// Create prescription
const createPrescription = async (req, res) => {
  const { patientId, appointmentId, diagnosis, medicines, notes } = req.body;
  const prescription = await Prescription.create({
    patient: patientId, doctor: req.user._id,
    appointment: appointmentId, diagnosis, medicines, notes,
  });
  res.status(201).json(prescription);
};

// Get prescriptions for a patient
const getPatientPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find({ patient: req.params.patientId })
    .populate('doctor', 'name specialization')
    .sort({ createdAt: -1 });
  res.json(prescriptions);
};

// Get logged-in patient's prescriptions
const getMyPrescriptions = async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  const prescriptions = await Prescription.find({ patient: patient._id })
    .populate('doctor', 'name specialization')
    .sort({ createdAt: -1 });
  res.json(prescriptions);
};

// Download PDF
const downloadPrescriptionPDF = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
  const patient = await Patient.findById(prescription.patient);
  const doctor = await User.findById(prescription.doctor);

  const pdfBuffer = await generatePrescriptionPDF(prescription, patient, doctor);
  res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename=prescription-${prescription._id}.pdf` });
  res.send(pdfBuffer);
};

module.exports = { createPrescription, getPatientPrescriptions, getMyPrescriptions, downloadPrescriptionPDF };