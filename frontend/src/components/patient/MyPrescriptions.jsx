import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPrescriptions } from '../../features/prescriptions/prescriptionSlice';
import { explainPrescription } from '../../features/ai/aiSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../api/axios';

export default function MyPrescriptions() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(state => state.prescriptions);
  const { explanation, loading: aiLoading } = useSelector(state => state.ai);

  useEffect(() => { dispatch(fetchMyPrescriptions()); }, [dispatch]);

  const handleDownload = async (id) => {
    try {
      const res = await api.get(`/prescriptions/${id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url; a.download = `prescription-${id}.pdf`; a.click();
    } catch { alert('Download failed'); }
  };

  const handleExplain = (id) => dispatch(explainPrescription(id));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">My Prescriptions ({list.length})</h3>

      {explanation && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
          <h4 className="font-bold text-blue-400 mb-2">🤖 AI Explanation</h4>
          <p className="text-slate-300 text-sm leading-relaxed">{explanation}</p>
        </div>
      )}

      <div className="space-y-4">
        {list.map(rx => (
          <div key={rx._id} className="card space-y-4">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <p className="font-bold text-white text-lg">{rx.diagnosis}</p>
                <p className="text-sm text-slate-400">Dr. {rx.doctor?.name} • {new Date(rx.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleExplain(rx._id)} disabled={aiLoading} className="btn-secondary text-sm py-1.5 px-3">
                  {aiLoading ? '...' : '🤖 Explain'}
                </button>
                <button onClick={() => handleDownload(rx._id)} className="btn-primary text-sm py-1.5 px-3">📄 PDF</button>
              </div>
            </div>

            <div className="space-y-2">
              {rx.medicines?.map((med, i) => (
                <div key={i} className="bg-slate-900 rounded-xl p-3 border border-slate-700 flex flex-wrap gap-4 items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-white">💊 {med.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {med.dosage && <span className="badge-blue">{med.dosage}</span>}
                      {med.frequency && <span className="badge-yellow">{med.frequency}</span>}
                      {med.duration && <span className="badge-green">{med.duration}</span>}
                    </div>
                    {med.instructions && <p className="text-xs text-slate-400 mt-1">{med.instructions}</p>}
                  </div>
                </div>
              ))}
            </div>

            {rx.notes && <p className="text-sm text-slate-400 border-t border-slate-700 pt-3">📝 {rx.notes}</p>}
          </div>
        ))}
        {list.length === 0 && <p className="text-slate-400 text-center py-12">No prescriptions found.</p>}
      </div>
    </div>
  );
}