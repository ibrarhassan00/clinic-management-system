// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App






// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { store } from './app/store';
// import ProtectedRoute from './components/common/ProtectedRoute';

// import Login from './pages/Login';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import DoctorDashboard from './pages/doctor/DoctorDashboard';
// import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
// import PatientDashboard from './pages/patient/PatientDashboard';

// export default function App() {
//   return (
//     <Provider store={store}>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="/login" element={<Login />} />

//           <Route path="/admin/*" element={
//             <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
//           } />
//           <Route path="/doctor/*" element={
//             <ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>
//           } />
//           <Route path="/receptionist/*" element={
//             <ProtectedRoute roles={['receptionist']}><ReceptionistDashboard /></ProtectedRoute>
//           } />
//           <Route path="/patient/*" element={
//             <ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>
//           } />

//           <Route path="/unauthorized" element={
//             <div className="min-h-screen flex items-center justify-center flex-col gap-4">
//               <h1 className="text-5xl font-bold text-red-400">403</h1>
//               <p className="text-slate-400">Not authorized</p>
//               <a href="/login" className="btn-primary">← Back to Login</a>
//             </div>
//           } />
//           <Route path="*" element={
//             <div className="min-h-screen flex items-center justify-center flex-col gap-4">
//               <h1 className="text-5xl font-bold text-slate-400">404</h1>
//               <p className="text-slate-400">Page not found</p>
//               <a href="/login" className="btn-primary">← Back to Login</a>
//             </div>
//           } />
//         </Routes>
//       </BrowserRouter>
//     </Provider>
//   );
// }




import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<ProtectedRoute roles={['admin']}><AdminDashboard defaultTab="doctors" /></ProtectedRoute>} />
          <Route path="/admin/receptionists" element={<ProtectedRoute roles={['admin']}><AdminDashboard defaultTab="receptionists" /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminDashboard defaultTab="analytics" /></ProtectedRoute>} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/appointments" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard defaultTab="appointments" /></ProtectedRoute>} />
          <Route path="/doctor/symptom-checker" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard defaultTab="symptom" /></ProtectedRoute>} />

          {/* Receptionist Routes */}
          <Route path="/receptionist/dashboard" element={<ProtectedRoute roles={['receptionist']}><ReceptionistDashboard /></ProtectedRoute>} />
          <Route path="/receptionist/patients" element={<ProtectedRoute roles={['receptionist']}><ReceptionistDashboard defaultTab="patients" /></ProtectedRoute>} />
          <Route path="/receptionist/book" element={<ProtectedRoute roles={['receptionist']}><ReceptionistDashboard defaultTab="book" /></ProtectedRoute>} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute roles={['patient']}><PatientDashboard defaultTab="appointments" /></ProtectedRoute>} />
          <Route path="/patient/prescriptions" element={<ProtectedRoute roles={['patient']}><PatientDashboard defaultTab="prescriptions" /></ProtectedRoute>} />

          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
              <h1 className="text-5xl font-bold text-red-400">403</h1>
              <p className="text-slate-400">Not authorized</p>
              <a href="/login" className="btn-primary">← Back to Login</a>
            </div>
          } />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
              <h1 className="text-5xl font-bold text-slate-400">404</h1>
              <p className="text-slate-400">Page not found</p>
              <a href="/login" className="btn-primary">← Back to Login</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}