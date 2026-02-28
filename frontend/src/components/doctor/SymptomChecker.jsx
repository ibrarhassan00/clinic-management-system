import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runSymptomChecker, clearAI } from '../../features/ai/aiSlice';

export default function SymptomChecker() {
  const dispatch = useDispatch();
  const { symptomResult, loading, error } = useSelector(state => state.ai);
  const [form, setForm] = useState({ patientId: '', symptoms: '', age: '', gender: 'male', history: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(runSymptomChecker({ ...form, symptoms: form.symptoms.split(',').map(s => s.trim()).filter(Boolean) }));
  };

  const riskColors = { low: 'badge-green', medium: 'badge-yellow', high: 'badge-red' };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">🤖 AI Symptom Checker</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Patient ID (MongoDB)</label>
              <input className="input" placeholder="Patient ObjectId" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required />
            </div>
            <div>
              <label className="label">Age</label>
              <input type="number" className="input" placeholder="e.g. 35" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="label">Symptoms (comma separated)</label>
            <input className="input" placeholder="fever, cough, headache" value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Medical History (optional)</label>
              <input className="input" placeholder="Diabetes, Hypertension..." value={form.history} onChange={e => setForm({ ...form, history: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? '⏳ Analyzing...' : '🔍 Run AI Analysis'}
            </button>
            <button type="button" onClick={() => dispatch(clearAI())} className="btn-secondary px-6">Clear</button>
          </div>
        </form>
      </div>

      {error && <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl">⚠️ AI unavailable. Using fallback. {error}</div>}

      {symptomResult && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-white">AI Analysis Results</h4>
            <span className={riskColors[symptomResult.riskLevel]}>Risk: {symptomResult.riskLevel?.toUpperCase()}</span>
          </div>

          {symptomResult.conditions?.length > 0 && (
            <div>
              <h5 className="font-semibold text-slate-300 mb-2">Possible Conditions</h5>
              <div className="space-y-2">
                {symptomResult.conditions.map((c, i) => (
                  <div key={i} className="bg-slate-900 rounded-xl p-3 border border-slate-700">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-white">{c.name}</p>
                      <span className="badge-yellow text-xs">{c.probability}</span>
                    </div>
                    {c.description && <p className="text-sm text-slate-400 mt-1">{c.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {symptomResult.suggestedTests?.length > 0 && (
            <div>
              <h5 className="font-semibold text-slate-300 mb-2">Suggested Tests</h5>
              <div className="flex flex-wrap gap-2">
                {symptomResult.suggestedTests.map((t, i) => <span key={i} className="badge-blue">{t}</span>)}
              </div>
            </div>
          )}

          {symptomResult.advice && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <h5 className="font-semibold text-blue-400 mb-1">💡 Advice</h5>
              <p className="text-slate-300 text-sm">{symptomResult.advice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}