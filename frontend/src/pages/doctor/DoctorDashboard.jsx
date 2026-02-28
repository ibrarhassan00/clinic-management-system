import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import AppointmentList from '../../components/doctor/AppointmentList';
import SymptomChecker from '../../components/doctor/SymptomChecker';
import WritePrescription from '../../components/doctor/WritePrescription';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DoctorDashboard({ defaultTab = 'appointments' }) {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    api.get('/doctor/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

    useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const tabs = [
    { key: 'appointments', label: '📅 Appointments' },
    { key: 'symptom', label: '🤖 AI Checker' },
    { key: 'prescription', label: '💊 Prescriptions' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Doctor Dashboard" />
        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Today's Appointments" value={stats.todayAppointments} icon="🗓️" color="blue" />
              <StatCard title="Total Appointments" value={stats.totalAppointments} icon="📅" color="emerald" />
              <StatCard title="Completed" value={stats.completedAppointments} icon="✅" color="purple" />
              <StatCard title="Prescriptions Written" value={stats.totalPrescriptions} icon="💊" color="orange" />
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'appointments' && <AppointmentList />}
          {activeTab === 'symptom' && <SymptomChecker />}
          {activeTab === 'prescription' && <WritePrescription />}
        </main>
      </div>
    </div>
  );
}