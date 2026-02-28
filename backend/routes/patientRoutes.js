const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getMyProfile,
  getMyTimeline,
  getMyAppointments,
  getMyPrescriptions,
  getMyDiagnosisLogs,
  updateMyProfile,
  getPatientById,
  getPatientHistory,
} = require('../controllers/patientController');

// ── Patient's own routes ──────────────────────
router.get('/profile',        protect, authorize('patient'), getMyProfile);
router.get('/timeline',       protect, authorize('patient'), getMyTimeline);
router.get('/appointments',   protect, authorize('patient'), getMyAppointments);
router.get('/prescriptions',  protect, authorize('patient'), getMyPrescriptions);
router.get('/diagnosis-logs', protect, authorize('patient'), getMyDiagnosisLogs);
router.put('/profile',        protect, authorize('patient'), updateMyProfile);

// ── Doctor / Admin routes ─────────────────────
router.get('/:id',         protect, authorize('doctor', 'admin'), getPatientById);
router.get('/:id/history', protect, authorize('doctor', 'admin'), getPatientHistory);

module.exports = router;