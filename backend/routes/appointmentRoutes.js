const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { bookAppointment, getAllAppointments, getDoctorAppointments, updateAppointmentStatus, cancelAppointment, getPatientAppointments } = require('../controllers/appointmentController');

router.post('/', protect, authorize('receptionist', 'admin'), bookAppointment);
router.get('/', protect, authorize('admin', 'receptionist'), getAllAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.get('/patient', protect, authorize('patient'), getPatientAppointments);
router.patch('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);
router.patch('/:id/cancel', protect, authorize('receptionist', 'admin', 'doctor'), cancelAppointment);

module.exports = router;