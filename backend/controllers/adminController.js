const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Get all doctors
const getDoctors = async (req, res) => {
  const doctors = await User.find({ role: 'doctor' }).select('-password');
  res.json(doctors);
};

// Get all receptionists
const getReceptionists = async (req, res) => {
  const receptionists = await User.find({ role: 'receptionist' }).select('-password');
  res.json(receptionists);
};

// Create doctor or receptionist
const createUser = async (req, res) => {
  const { name, email, password, role, specialization, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role, specialization, phone });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
};

// Delete user
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.deleteOne();
  res.json({ message: 'User removed' });
};

// Toggle user active status
const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
};

// Analytics
const getAnalytics = async (req, res) => {
  const totalPatients = await Patient.countDocuments();
  const totalDoctors = await User.countDocuments({ role: 'doctor' });
  const totalAppointments = await Appointment.countDocuments();
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const todayAppointments = await Appointment.countDocuments({ date: { $gte: todayStart } });

  // Monthly appointments
  const monthly = await Appointment.aggregate([
    { $group: { _id: { $month: '$date' }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } }
  ]);

  res.json({ totalPatients, totalDoctors, totalAppointments, todayAppointments, monthly });
};

// Update subscription plan
const updatePlan = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.plan = req.body.plan;
  await user.save();
  res.json({ message: 'Plan updated', plan: user.plan });
};

module.exports = { getDoctors, getReceptionists, createUser, deleteUser, toggleUserStatus, getAnalytics, updatePlan };