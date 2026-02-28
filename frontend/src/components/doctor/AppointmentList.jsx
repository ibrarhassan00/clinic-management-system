import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorAppointments, updateStatus, cancelAppointment } from '../../features/appointments/appointmentSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const statusBadge = (s) => {
  const map = { pending: 'badge-yellow', confirmed: 'badge-blue', completed: 'badge-green', cancelled: 'badge-red' };
  return <span className={map[s] || 'badge-yellow'}>{s}</span>;
};

export default function AppointmentList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(state => state.appointments);

  useEffect(() => { dispatch(fetchDoctorAppointments()); }, [dispatch]);

  const handleStatus = (id, status) => dispatch(updateStatus({ id, status }));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">My Appointments ({list.length})</h3>
      {list.length === 0 && <p className="text-slate-400 text-center py-12">No appointments yet.</p>}
      <div className="space-y-3">
        {list.map(apt => (
          <div key={apt._id} className="card flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                {apt.patient?.name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-semibold text-white">{apt.patient?.name}</p>
                <p className="text-sm text-slate-400">Age: {apt.patient?.age} • {apt.patient?.gender}</p>
                <p className="text-xs text-slate-500">{new Date(apt.date).toLocaleDateString()} {apt.timeSlot && `• ${apt.timeSlot}`}</p>
                {apt.reason && <p className="text-xs text-slate-400 mt-1">Reason: {apt.reason}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {statusBadge(apt.status)}
              {apt.status === 'pending' && (
                <button onClick={() => handleStatus(apt._id, 'confirmed')} className="btn-success text-sm py-1.5 px-3">✓ Confirm</button>
              )}
              {apt.status === 'confirmed' && (
                <button onClick={() => handleStatus(apt._id, 'completed')} className="btn-primary text-sm py-1.5 px-3">Complete</button>
              )}
              {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                <button onClick={() => dispatch(cancelAppointment(apt._id))} className="btn-danger text-sm py-1.5 px-3">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}