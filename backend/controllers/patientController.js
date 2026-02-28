const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const DiagnosisLog = require('../models/DiagnosisLog');

// ─────────────────────────────────────────────
// @desc    Get logged-in patient's own profile
// @route   GET /api/patient/profile
// @access  Patient only
// ─────────────────────────────────────────────
const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id })
      .populate('registeredBy', 'name role');

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found. Please contact reception.' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get logged-in patient's full medical timeline
//          (appointments + prescriptions + diagnosis logs)
// @route   GET /api/patient/timeline
// @access  Patient only
// ─────────────────────────────────────────────
const getMyTimeline = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const [appointments, prescriptions, diagnosisLogs] = await Promise.all([
      Appointment.find({ patient: patient._id })
        .populate('doctor', 'name specialization')
        .sort({ date: -1 }),

      Prescription.find({ patient: patient._id })
        .populate('doctor', 'name specialization')
        .sort({ createdAt: -1 }),

      DiagnosisLog.find({ patient: patient._id })
        .populate('doctor', 'name specialization')
        .sort({ createdAt: -1 }),
    ]);

    res.json({
      patient,
      appointments,
      prescriptions,
      diagnosisLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get logged-in patient's appointments
// @route   GET /api/patient/appointments
// @access  Patient only
// ─────────────────────────────────────────────
const getMyAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate('doctor', 'name specialization phone')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get logged-in patient's prescriptions
// @route   GET /api/patient/prescriptions
// @access  Patient only
// ─────────────────────────────────────────────
const getMyPrescriptions = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const prescriptions = await Prescription.find({ patient: patient._id })
      .populate('doctor', 'name specialization')
      .populate('appointment', 'date timeSlot status')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get logged-in patient's diagnosis logs (AI history)
// @route   GET /api/patient/diagnosis-logs
// @access  Patient only
// ─────────────────────────────────────────────
const getMyDiagnosisLogs = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const logs = await DiagnosisLog.find({ patient: patient._id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update logged-in patient's own info
//          (phone, address only — sensitive fields via receptionist)
// @route   PUT /api/patient/profile
// @access  Patient only
// ─────────────────────────────────────────────
const updateMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Only allow safe fields to be updated by patient themselves
    const allowedFields = ['phone', 'address'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    const updated = await patient.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get single patient by ID
//          (used by doctor & admin)
// @route   GET /api/patient/:id
// @access  Doctor, Admin
// ─────────────────────────────────────────────
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('registeredBy', 'name role');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get full history of any patient by ID
//          (used by doctor to view patient history)
// @route   GET /api/patient/:id/history
// @access  Doctor, Admin
// ─────────────────────────────────────────────
const getPatientHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const [appointments, prescriptions, diagnosisLogs] = await Promise.all([
      Appointment.find({ patient: req.params.id })
        .populate('doctor', 'name specialization')
        .sort({ date: -1 }),

      Prescription.find({ patient: req.params.id })
        .populate('doctor', 'name specialization')
        .populate('appointment', 'date timeSlot')
        .sort({ createdAt: -1 }),

      DiagnosisLog.find({ patient: req.params.id })
        .populate('doctor', 'name specialization')
        .sort({ createdAt: -1 }),
    ]);

    res.json({
      patient,
      appointments,
      prescriptions,
      diagnosisLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMyProfile,
  getMyTimeline,
  getMyAppointments,
  getMyPrescriptions,
  getMyDiagnosisLogs,
  updateMyProfile,
  getPatientById,
  getPatientHistory,
};