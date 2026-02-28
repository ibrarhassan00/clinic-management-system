import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from '../../features/patients/patientSlice';
import LoadingSpinner from '../common/LoadingSpinner';

export default function PatientsList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(state => state.patients);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchPatients()); }, [dispatch]);

  const filtered = list.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center justify-between flex-wrap">
        <h3 className="text-xl font-bold text-white">All Patients ({list.length})</h3>
        <input className="input w-64" placeholder="🔍 Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-3">
        {filtered.map(p => (
          <div key={p._id} className="card flex items-center gap-4 justify-between flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
                {p.name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{p.name}</p>
                <p className="text-sm text-slate-400">{p.age && `Age: ${p.age}`} {p.gender && `• ${p.gender}`} {p.bloodGroup && `• ${p.bloodGroup}`}</p>
                <p className="text-xs text-slate-500">{p.phone} {p.address && `• ${p.address}`}</p>
              </div>
            </div>
            <span className="badge-blue text-xs">ID: {p._id.slice(-6)}</span>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-slate-400 text-center py-12">No patients found.</p>}
      </div>
    </div>
  );
}