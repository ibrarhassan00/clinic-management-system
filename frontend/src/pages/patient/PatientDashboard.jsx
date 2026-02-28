import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import MyAppointments from '../../components/patient/MyAppointments';
import MyPrescriptions from '../../components/patient/MyPrescriptions';
import { fetchMyProfile } from '../../features/patients/patientSlice';
import { useState } from 'react';

export default function PatientDashboard({ defaultTab = 'appointments' }) {
  const dispatch = useDispatch();
  const { myProfile } = useSelector(state => state.patients);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => { dispatch(fetchMyProfile()); }, [dispatch]);

  const tabs = [
    { key: 'appointments', label: '📅 My Appointments' },
    { key: 'prescriptions', label: '💊 My Prescriptions' },
  ];

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Patient Portal" />
        <main className="flex-1 p-6 space-y-6">
          {/* Profile Card */}
          {myProfile && (
            <div className="card flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold">
                {myProfile.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{myProfile.name}</h3>
                <p className="text-slate-400">Age: {myProfile.age} • {myProfile.gender} • Blood: <span className="text-red-400 font-bold">{myProfile.bloodGroup || 'N/A'}</span></p>
                <p className="text-slate-500 text-sm mt-1">{myProfile.phone} • {myProfile.address}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'appointments' && <MyAppointments />}
          {activeTab === 'prescriptions' && <MyPrescriptions />}
        </main>
      </div>
    </div>
  );
}