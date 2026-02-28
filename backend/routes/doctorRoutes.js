const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { getDoctorStats, getPatientHistory } = require('../controllers/doctorController');

router.use(protect, authorize('doctor'));

router.get('/stats', getDoctorStats);
router.get('/patient/:patientId/history', getPatientHistory);

module.exports = router;