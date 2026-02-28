import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import appointmentReducer from '../features/appointments/appointmentSlice';
import patientReducer from '../features/patients/patientSlice';
import prescriptionReducer from '../features/prescriptions/prescriptionSlice';
import aiReducer from '../features/ai/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentReducer,
    patients: patientReducer,
    prescriptions: prescriptionReducer,
    ai: aiReducer,
  },
});