import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bookAppointment } from '../../features/appointments/appointmentSlice';
import api from '../../api/axios';

export default function BookAppointment() {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', timeSlot: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { api.get('/receptionist/doctors').then(r => setDoctors(r.data)).catch(() => {}); }, []);

  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await dispatch(bookAppointment(form)).unwrap();
      setSuccess(true); setForm({ patientId: '', doctorId: '', date: '', timeSlot: '', reason: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { alert(err || 'Failed to book'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      {success && <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl mb-4">✅ Appointment booked!</div>}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">📅 Book Appointment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Patient ID</label>
            <input className="input" placeholder="Copy from Patients list" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required />
          </div>
          <div>
            <label className="label">Select Doctor</label>
            <select className="input" value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })} required>
              <option value="">-- Select Doctor --</option>
              {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name} {d.specialization && `(${d.specialization})`}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input type="date" className="input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="label">Time Slot</label>
              <select className="input" value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })} required>
                <option value="">-- Select Slot --</option>
                {timeSlots.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Reason (optional)</label>
            <input className="input" placeholder="Chief complaint" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Booking...' : '📅 Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}