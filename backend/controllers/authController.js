// const User = require('../models/User');
// const generateToken = require('../utils/generateToken');

// // @desc Login
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       plan: user.plan,
//       token: generateToken(user._id, user.role),
//     });
//   } else {
//     res.status(401).json({ message: 'Invalid email or password' });
//   }
// };

// // @desc Register (Admin only creates users mostly)
// const registerUser = async (req, res) => {
//   const { name, email, password, role, specialization, phone } = req.body;
//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: 'User already exists' });

//   const user = await User.create({ name, email, password, role, specialization, phone });
//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     token: generateToken(user._id, user.role),
//   });
// };

// // @desc Get logged in user profile
// const getMe = async (req, res) => {
//   res.json(req.user);
// };

// module.exports = { loginUser, registerUser, getMe };






// const User = require('../models/User');
// const generateToken = require('../utils/generateToken');

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       plan: user.plan,
//       token: generateToken(user._id, user.role),
//     });
//   } else {
//     res.status(401).json({ message: 'Invalid email or password' });
//   }
// };

// const registerUser = async (req, res) => {
//   const { name, email, password, role, specialization, phone } = req.body;
//   const exists = await User.findOne({ email });
//   if (exists) return res.status(400).json({ message: 'User already exists' });
//   const user = await User.create({ name, email, password, role, specialization, phone });
//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     token: generateToken(user._id, user.role),
//   });
// };

// const getMe = async (req, res) => {
//   res.json(req.user);
// };

// // Pehli baar admin banana — agar koi admin exist na kare
// const seedAdmin = async (req, res) => {
//   try {
//     const adminExists = await User.findOne({ role: 'admin' });
//     if (adminExists) {
//       return res.status(400).json({ message: 'Admin already exists. Use login.' });
//     }
//     const admin = await User.create({
//       name: 'Super Admin',
//       email: 'admin@clinic.com',
//       password: 'admin123',
//       role: 'admin',
//       plan: 'pro',
//     });
//     res.status(201).json({
//       message: 'Admin created successfully',
//       email: admin.email,
//       password: 'admin123',
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { loginUser, registerUser, getMe, seedAdmin };







const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role, specialization, phone });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Me
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed Admin — pehli baar admin banana
// const seedAdmin = async (req, res) => {
//   try {
//     const adminExists = await User.findOne({ role: 'admin' });
//     if (adminExists) {
//       return res.status(400).json({ message: 'Admin already exists. Use login.' });
//     }
//     const admin = await User.create({
//       name: 'Super Admin',
//       email: 'admin@clinic.com',
//       password: 'admin123',
//       role: 'admin',
//       plan: 'pro',
//     });
//     res.status(201).json({
//       message: 'Admin created successfully',
//       email: admin.email,
//       password: 'admin123',
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = { loginUser, registerUser, getMe,  };



