import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientAppointments } from '../../features/appointments/appointmentSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const statusBadge = (s) => {
  const map = { pending: 'badge-yellow', confirmed: 'badge-blue', completed: 'badge-green', cancelled: 'badge-red' };
  return <span className={map[s] || 'badge-yellow'}>{s}</span>;
};

export default function MyAppointments() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(state => state.appointments);

  useEffect(() => { dispatch(fetchPatientAppointments()); }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">My Appointments ({list.length})</h3>
      {list.length === 0 && <p className="text-slate-400 text-center py-12">No appointments yet.</p>}
      <div className="space-y-3">
        {list.map(apt => (
          <div key={apt._id} className="card flex flex-wrap gap-4 justify-between items-center">
            <div>
              <p className="font-semibold text-white">Dr. {apt.doctor?.name}</p>
              <p className="text-sm text-emerald-400">{apt.doctor?.specialization}</p>
              <p className="text-sm text-slate-400 mt-1">{new Date(apt.date).toLocaleDateString()} {apt.timeSlot && `• ${apt.timeSlot}`}</p>
              {apt.reason && <p className="text-xs text-slate-500">Reason: {apt.reason}</p>}
            </div>
            {statusBadge(apt.status)}
          </div>
        ))}
      </div>
    </div>
  );
}