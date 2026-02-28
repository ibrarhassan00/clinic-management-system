const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const DiagnosisLog = require('../models/DiagnosisLog');

// Get doctor stats
const getDoctorStats = async (req, res) => {
  const totalAppointments = await Appointment.countDocuments({ doctor: req.user._id });
  const completedAppointments = await Appointment.countDocuments({ doctor: req.user._id, status: 'completed' });
  const totalPrescriptions = await Prescription.countDocuments({ doctor: req.user._id });

  const today = new Date(); today.setHours(0,0,0,0);
  const todayAppointments = await Appointment.countDocuments({ doctor: req.user._id, date: { $gte: today } });

  res.json({ totalAppointments, completedAppointments, totalPrescriptions, todayAppointments });
};

// Get patient history
const getPatientHistory = async (req, res) => {
  const { patientId } = req.params;
  const appointments = await Appointment.find({ patient: patientId, doctor: req.user._id }).sort({ date: -1 });
  const prescriptions = await Prescription.find({ patient: patientId, doctor: req.user._id }).sort({ createdAt: -1 });
  const diagnosisLogs = await DiagnosisLog.find({ patient: patientId, doctor: req.user._id }).sort({ createdAt: -1 });

  res.json({ appointments, prescriptions, diagnosisLogs });
};

module.exports = { getDoctorStats, getPatientHistory };