import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import ManageDoctors from '../../components/admin/ManageDoctors';
import ManageReceptionists from '../../components/admin/ManageReceptionists';
import AnalyticsChart from "../../components/admin/AnalyticsChart";
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboard({ defaultTab = 'overview' }) {
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(r => { setAnalytics(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

    // URL change hone par tab update karo
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);
  

  const tabs = ['overview', 'doctors', 'receptionists', 'analytics'];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Admin Dashboard" />
        <main className="flex-1 p-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              {loading ? <LoadingSpinner /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard title="Total Patients" value={analytics?.totalPatients || 0} icon="👥" color="blue" />
                  <StatCard title="Total Doctors" value={analytics?.totalDoctors || 0} icon="👨‍⚕️" color="emerald" />
                  <StatCard title="Total Appointments" value={analytics?.totalAppointments || 0} icon="📅" color="purple" />
                  <StatCard title="Today's Appointments" value={analytics?.todayAppointments || 0} icon="🗓️" color="orange" />
                </div>
              )}
            </>
          )}

          {activeTab === 'doctors' && <ManageDoctors />}
          {activeTab === 'receptionists' && <ManageReceptionists />}
          {activeTab === 'analytics' && <AnalyticsChart monthly={analytics?.monthly || []} />}
        </main>
      </div>
    </div>
  );
}