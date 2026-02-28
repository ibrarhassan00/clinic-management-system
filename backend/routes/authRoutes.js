// const express = require('express');
// const router = express.Router();
// const { loginUser, registerUser, getMe } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// router.post('/login', loginUser);
// router.post('/register', registerUser); // can restrict to admin only in prod
// router.get('/me', protect, getMe);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getMe, seedAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getMe);
//router.post('/seed-admin', seedAdmin); // ek baar admin banane ke liye

module.exports = router;