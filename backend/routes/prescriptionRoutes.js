const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createPrescription, getPatientPrescriptions, getMyPrescriptions, downloadPrescriptionPDF } = require('../controllers/prescriptionController');

router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/my', protect, authorize('patient'), getMyPrescriptions);
router.get('/patient/:patientId', protect, authorize('doctor', 'admin'), getPatientPrescriptions);
router.get('/:id/pdf', protect, downloadPrescriptionPDF);

module.exports = router;