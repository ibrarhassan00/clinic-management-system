const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// Book appointment
const bookAppointment = async (req, res) => {
  const { patientId, doctorId, date, timeSlot, reason } = req.body;
  const appointment = await Appointment.create({
    patient: patientId, doctor: doctorId, date, timeSlot, reason,
    bookedBy: req.user._id,
  });
  res.status(201).json(appointment);
};

// Get all appointments (admin/receptionist)
const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patient', 'name age gender')
    .populate('doctor', 'name specialization')
    .sort({ date: -1 });
  res.json(appointments);
};

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.user._id })
    .populate('patient', 'name age gender phone')
    .sort({ date: 1 });
  res.json(appointments);
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  appointment.status = req.body.status;
  if (req.body.notes) appointment.notes = req.body.notes;
  await appointment.save();
  res.json(appointment);
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  appointment.status = 'cancelled';
  await appointment.save();
  res.json({ message: 'Appointment cancelled' });
};

// Get patient's appointments
const getPatientAppointments = async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  const appointments = await Appointment.find({ patient: patient._id })
    .populate('doctor', 'name specialization')
    .sort({ date: -1 });
  res.json(appointments);
};

module.exports = { bookAppointment, getAllAppointments, getDoctorAppointments, updateAppointmentStatus, cancelAppointment, getPatientAppointments };