import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/auth/authSlice';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) navigate(`/${user.role}/dashboard`, { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser(form));
  };

  const roleMap = { admin: '#2563eb', doctor: '#059669', receptionist: '#7c3aed', patient: '#dc2626' };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-white mb-2">🏥 <span className="text-blue-400">Clinic</span>Pro</h1>
          <p className="text-slate-400">Smart Clinic Management System</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="doctor@clinic.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center mb-3">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['admin', 'doctor', 'receptionist', 'patient'].map(role => (
                <button key={role} onClick={() => setForm({ email: `${role}@clinic.com`, password: 'password123' })}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded-lg capitalize transition">
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser, clearError } from '../features/auth/authSlice';
// import api from '../api/axios';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [activeTab, setActiveTab] = useState('login'); // login | setup
//   const [seedMsg, setSeedMsg] = useState('');
//   const [seedLoading, setSeedLoading] = useState(false);
//   const [seedDone, setSeedDone] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, user } = useSelector(state => state.auth);

//   useEffect(() => {
//     if (user) navigate(`/${user.role}/dashboard`, { replace: true });
//   }, [user, navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     dispatch(clearError());
//     dispatch(loginUser(form));
//   };

//   const handleSeedAdmin = async () => {
//     setSeedLoading(true);
//     setSeedMsg('');
//     try {
//       const { data } = await api.post('/auth/seed-admin');
//       setSeedMsg(`✅ ${data.message} — Email: ${data.email} | Password: ${data.password}`);
//       setSeedDone(true);
//     } catch (err) {
//       setSeedMsg(`⚠️ ${err.response?.data?.message || 'Error occurred'}`);
//     } finally {
//       setSeedLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
//       {/* Background blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-5xl font-extrabold text-white mb-2">
//             🏥 <span className="text-blue-400">Clinic</span>Pro
//           </h1>
//           <p className="text-slate-400">Smart Clinic Management System</p>
//         </div>

//         <div className="card">
//           {/* Tabs */}
//           <div className="flex mb-6 bg-slate-900 rounded-xl p-1">
//             <button
//               onClick={() => setActiveTab('login')}
//               className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
//               🔐 Login
//             </button>
//             <button
//               onClick={() => setActiveTab('setup')}
//               className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'setup' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
//               ⚙️ First Setup
//             </button>
//           </div>

//           {/* LOGIN TAB */}
//           {activeTab === 'login' && (
//             <>
//               <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
//               {error && (
//                 <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
//                   ⚠️ {error}
//                 </div>
//               )}
//               <form onSubmit={handleLogin} className="space-y-4">
//                 <div>
//                   <label className="label">Email Address</label>
//                   <input
//                     type="email" className="input" placeholder="admin@clinic.com"
//                     value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
//                 </div>
//                 <div>
//                   <label className="label">Password</label>
//                   <input
//                     type="password" className="input" placeholder="••••••••"
//                     value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
//                 </div>
//                 <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
//                   {loading ? '⏳ Signing in...' : '🔐 Sign In'}
//                 </button>
//               </form>

//               {/* Quick fill buttons */}
//               <div className="mt-6 pt-4 border-t border-slate-700">
//                 <p className="text-xs text-slate-500 text-center mb-3">Quick Fill (Demo)</p>
//                 <div className="grid grid-cols-2 gap-2">
//                   {[
//                     { role: 'admin', email: 'admin@clinic.com', pass: 'admin123' },
//                     { role: 'doctor', email: 'doctor@clinic.com', pass: 'doctor123' },
//                     { role: 'receptionist', email: 'reception@clinic.com', pass: 'recep123' },
//                     { role: 'patient', email: 'patient@clinic.com', pass: 'patient123' },
//                   ].map(u => (
//                     <button key={u.role}
//                       onClick={() => setForm({ email: u.email, password: u.pass })}
//                       className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded-lg capitalize transition text-sm">
//                       {u.role}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* SETUP TAB */}
//           {activeTab === 'setup' && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold text-white mb-2">First Time Setup</h2>
//               <p className="text-slate-400 text-sm">
//                 Pehli baar system use kar rahe ho? Pehle <strong className="text-white">Admin account</strong> banao.
//                 Phir admin se doctors aur receptionists banwao.
//               </p>

//               <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 space-y-2 text-sm">
//                 <p className="text-slate-300 font-semibold">System Flow:</p>
//                 <p className="text-slate-400">1️⃣ Admin create karo (yahan se)</p>
//                 <p className="text-slate-400">2️⃣ Admin login karo</p>
//                 <p className="text-slate-400">3️⃣ Admin → Doctors banao</p>
//                 <p className="text-slate-400">4️⃣ Admin → Receptionists banao</p>
//                 <p className="text-slate-400">5️⃣ Receptionist → Patients register kare</p>
//               </div>

//               {seedMsg && (
//                 <div className={`px-4 py-3 rounded-xl text-sm ${seedDone ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
//                   {seedMsg}
//                 </div>
//               )}

//               {!seedDone ? (
//                 <button
//                   onClick={handleSeedAdmin}
//                   disabled={seedLoading}
//                   className="btn-primary w-full py-3">
//                   {seedLoading ? '⏳ Creating Admin...' : '🚀 Create Admin Account'}
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => { setActiveTab('login'); setForm({ email: 'admin@clinic.com', password: 'admin123' }); }}
//                   className="btn-success w-full py-3">
//                   ✅ Go to Login
//                 </button>
//               )}

//               <p className="text-xs text-slate-500 text-center">
//                 ⚠️ Yeh button sirf ek baar kaam karega — agar admin exist kare to error aayega.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// // ```

// // ---

// // ## Flow Kuch Aisa Hoga
// // ```
// // 1. http://localhost:5173/login kholo
// // 2. "First Setup" tab click karo
// // 3. "Create Admin Account" click karo
// // 4. Admin ban jayega → "Go to Login" click karo
// // 5. Admin se login karo
// // 6. Admin dashboard mein doctors/receptionists banao
// // 7. Doctor/Receptionist login kar sakte hain
// // 8. Receptionist patients register kare