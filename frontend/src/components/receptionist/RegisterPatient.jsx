import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerPatient } from '../../features/patients/patientSlice';

export default function RegisterPatient({ onSuccess }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', bloodGroup: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await dispatch(registerPatient(form)).unwrap();
      setSuccess(true); setForm({ name: '', age: '', gender: 'male', bloodGroup: '', phone: '', address: '' });
      setTimeout(() => { setSuccess(false); onSuccess?.(); }, 1500);
    } catch (err) { alert(err || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      {success && <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl mb-4">✅ Patient registered successfully!</div>}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">➕ Register New Patient</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="Patient Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Age</label>
              <input type="number" className="input" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Blood Group</label>
              <select className="input" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="0300-1234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" placeholder="City, Area" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Registering...' : '✅ Register Patient'}
          </button>
        </form>
      </div>
    </div>
  );
}