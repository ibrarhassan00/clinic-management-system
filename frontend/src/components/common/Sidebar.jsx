import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const roleMenus = {
  admin: [
    { label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { label: 'Doctors', icon: '👨‍⚕️', path: '/admin/doctors' },
    { label: 'Receptionists', icon: '👩‍💼', path: '/admin/receptionists' },
    { label: 'Analytics', icon: '📈', path: '/admin/analytics' },
  ],
  doctor: [
    { label: 'Dashboard', icon: '🏥', path: '/doctor/dashboard' },
    { label: 'Appointments', icon: '📅', path: '/doctor/appointments' },
    { label: 'Symptom Checker', icon: '🤖', path: '/doctor/symptom-checker' },
  ],
  receptionist: [
    { label: 'Dashboard', icon: '🏠', path: '/receptionist/dashboard' },
    { label: 'Patients', icon: '👥', path: '/receptionist/patients' },
    { label: 'Book Appointment', icon: '📅', path: '/receptionist/book' },
  ],
  patient: [
    { label: 'Dashboard', icon: '👤', path: '/patient/dashboard' },
    { label: 'Appointments', icon: '📅', path: '/patient/appointments' },
    { label: 'Prescriptions', icon: '💊', path: '/patient/prescriptions' },
  ],
};

export default function Sidebar() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menu = roleMenus[user?.role] || [];

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col">
      <div className="p-6 border-b border-slate-700/50">
        <h1 className="text-2xl font-extrabold text-white">🏥 <span className="text-blue-400">Clinic</span>Pro</h1>
        <p className="text-xs text-slate-400 mt-1 capitalize">{user?.role} Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menu.map(item => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`
            }>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full btn-danger text-sm py-2">🚪 Logout</button>
      </div>
    </aside>
  );
}