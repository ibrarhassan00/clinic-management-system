const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { registerPatient, getAllPatients, updatePatient, getDoctors } = require('../controllers/receptionistController');

router.use(protect, authorize('receptionist', 'admin'));

router.post('/patients', registerPatient);
router.get('/patients', getAllPatients);
router.put('/patients/:id', updatePatient);
router.get('/doctors', getDoctors);

module.exports = router;