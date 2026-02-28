const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { getDoctors, getReceptionists, createUser, deleteUser, toggleUserStatus, getAnalytics, updatePlan } = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/doctors', getDoctors);
router.get('/receptionists', getReceptionists);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle', toggleUserStatus);
router.get('/analytics', getAnalytics);
router.patch('/users/:id/plan', updatePlan);

module.exports = router;