const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { symptomChecker, explainPrescription, checkRiskFlags } = require('../controllers/aiController');

router.post('/symptoms', protect, authorize('doctor'), symptomChecker);
router.get('/explain/:id', protect, explainPrescription);
router.get('/risk/:patientId', protect, authorize('doctor', 'admin'), checkRiskFlags);

module.exports = router;