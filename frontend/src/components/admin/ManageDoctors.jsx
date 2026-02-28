import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/admin/doctors').then(r => { setDoctors(r.data); setLoading(false); });
  };
  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post('/admin/users', { ...form, role: 'doctor' });
      setModal(false); setForm({ name: '', email: '', password: '', specialization: '', phone: '' }); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this doctor?')) return;
    await api.delete(`/admin/users/${id}`); load();
  };

  const handleToggle = async (id) => {
    await api.patch(`/admin/users/${id}/toggle`); load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Doctors ({doctors.length})</h3>
        <button onClick={() => setModal(true)} className="btn-primary">+ Add Doctor</button>
      </div>

      <div className="grid gap-4">
        {doctors.map(doc => (
          <div key={doc._id} className="card flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {doc.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">Dr. {doc.name}</p>
                <p className="text-sm text-slate-400">{doc.email}</p>
                {doc.specialization && <p className="text-xs text-emerald-400">{doc.specialization}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={doc.isActive ? 'badge-green' : 'badge-red'}>{doc.isActive ? 'Active' : 'Inactive'}</span>
              <button onClick={() => handleToggle(doc._id)} className="btn-secondary text-sm py-1.5 px-3">Toggle</button>
              <button onClick={() => handleDelete(doc._id)} className="btn-danger text-sm py-1.5 px-3">Delete</button>
            </div>
          </div>
        ))}
        {doctors.length === 0 && <p className="text-slate-400 text-center py-8">No doctors found. Add one!</p>}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add New Doctor">
        <form onSubmit={handleCreate} className="space-y-4">
          {[['name', 'Full Name'], ['email', 'Email'], ['password', 'Password'], ['specialization', 'Specialization'], ['phone', 'Phone']].map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} className="input" placeholder={label}
                value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key !== 'phone' && key !== 'specialization'} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Adding...' : 'Add Doctor'}</button>
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}