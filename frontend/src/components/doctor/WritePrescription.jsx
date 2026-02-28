import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPrescription } from '../../features/prescriptions/prescriptionSlice';

const emptyMed = { name: '', dosage: '', frequency: '', duration: '', instructions: '' };

export default function WritePrescription() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ patientId: '', appointmentId: '', diagnosis: '', notes: '' });
  const [medicines, setMedicines] = useState([{ ...emptyMed }]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const addMed = () => setMedicines([...medicines, { ...emptyMed }]);
  const removeMed = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));
  const updateMed = (i, key, val) => setMedicines(medicines.map((m, idx) => idx === i ? { ...m, [key]: val } : m));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await dispatch(createPrescription({ ...form, medicines })).unwrap();
      setSuccess(true); setForm({ patientId: '', appointmentId: '', diagnosis: '', notes: '' }); setMedicines([{ ...emptyMed }]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { alert(err || 'Error creating prescription'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl space-y-4">
      {success && <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl">✅ Prescription created successfully!</div>}

      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">💊 Write Prescription</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Patient ID</label>
              <input className="input" placeholder="Patient ObjectId" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required />
            </div>
            <div>
              <label className="label">Appointment ID (optional)</label>
              <input className="input" placeholder="Appointment ObjectId" value={form.appointmentId} onChange={e => setForm({ ...form, appointmentId: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="label">Diagnosis</label>
            <input className="input" placeholder="e.g. Viral Fever" value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} required />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="label mb-0">Medicines</label>
              <button type="button" onClick={addMed} className="btn-secondary text-sm py-1 px-3">+ Add</button>
            </div>
            <div className="space-y-3">
              {medicines.map((med, i) => (
                <div key={i} className="bg-slate-900 rounded-xl p-4 border border-slate-700 space-y-3">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-slate-300">Medicine {i + 1}</p>
                    {medicines.length > 1 && <button type="button" onClick={() => removeMed(i)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[['name', 'Medicine Name'], ['dosage', 'Dosage (e.g. 500mg)'], ['frequency', 'Frequency'], ['duration', 'Duration']].map(([key, ph]) => (
                      <div key={key}>
                        <input className="input text-sm py-2" placeholder={ph} value={med[key]} onChange={e => updateMed(i, key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <input className="input text-sm py-2" placeholder="Special instructions..." value={med.instructions} onChange={e => updateMed(i, 'instructions', e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Doctor Notes</label>
            <textarea className="input h-24 resize-none" placeholder="Additional notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creating...' : '📄 Create Prescription'}
          </button>
        </form>
      </div>
    </div>
  );
}