import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ManageReceptionists() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const load = () => { setLoading(true); api.get('/admin/receptionists').then(r => { setList(r.data); setLoading(false); }); };
  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await api.post('/admin/users', { ...form, role: 'receptionist' }); setModal(false); load(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/admin/users/${id}`); load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Receptionists ({list.length})</h3>
        <button onClick={() => setModal(true)} className="btn-primary">+ Add Receptionist</button>
      </div>
      <div className="grid gap-4">
        {list.map(r => (
          <div key={r._id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">{r.name.charAt(0)}</div>
              <div>
                <p className="font-semibold text-white">{r.name}</p>
                <p className="text-sm text-slate-400">{r.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className={r.isActive ? 'badge-green' : 'badge-red'}>{r.isActive ? 'Active' : 'Inactive'}</span>
              <button onClick={() => handleDelete(r._id)} className="btn-danger text-sm py-1.5 px-3">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Receptionist">
        <form onSubmit={handleCreate} className="space-y-4">
          {[['name', 'Full Name'], ['email', 'Email'], ['password', 'Password'], ['phone', 'Phone']].map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input type={key === 'password' ? 'password' : 'text'} className="input" placeholder={label}
                value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key !== 'phone'} />
            </div>
          ))}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">Add</button>
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}