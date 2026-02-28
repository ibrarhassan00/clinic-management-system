import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import PatientsList from '../../components/receptionist/PatientsList';
import RegisterPatient from '../../components/receptionist/RegisterPatient';
import BookAppointment from '../../components/receptionist/BookAppointment';

export default function ReceptionistDashboard({ defaultTab = 'patients' }) {
  const [activeTab, setActiveTab] = useState('patients');

  const tabs = [
    { key: 'patients', label: '👥 Patients' },
    { key: 'register', label: '➕ Register Patient' },
    { key: 'book', label: '📅 Book Appointment' },
  ];

    useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Receptionist Dashboard" />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {t.label}
              </button>
            ))}
          </div>
          {activeTab === 'patients' && <PatientsList />}
          {activeTab === 'register' && <RegisterPatient onSuccess={() => setActiveTab('patients')} />}
          {activeTab === 'book' && <BookAppointment />}
        </main>
      </div>
    </div>
  );
}