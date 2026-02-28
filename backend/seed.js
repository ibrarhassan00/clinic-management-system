const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => { console.error(err); process.exit(1); });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  plan: String,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const seed = async () => {
  // Pehle hash banao manually
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Purana admin delete karo agar ho
  await User.deleteOne({ email: 'admin@clinic.com' });
  console.log('Old admin removed (if existed)');

  // Seedha insert karo — no pre-save middleware
  await User.create({
    name: 'Super Admin',
    email: 'admin@clinic.com',
    password: hashedPassword,
    role: 'admin',
    plan: 'pro',
    isActive: true,
  });

  console.log('✅ Admin created!');
  console.log('Email: admin@clinic.com');
  console.log('Password: admin123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });