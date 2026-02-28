import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchAllAppointments = createAsyncThunk('appointments/fetchAll', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/appointments'); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchDoctorAppointments = createAsyncThunk('appointments/fetchDoctor', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/appointments/doctor'); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchPatientAppointments = createAsyncThunk('appointments/fetchPatient', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/appointments/patient'); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const bookAppointment = createAsyncThunk('appointments/book', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/appointments', payload); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateStatus = createAsyncThunk('appointments/updateStatus', async ({ id, status, notes }, { rejectWithValue }) => {
  try { const { data } = await api.patch(`/appointments/${id}/status`, { status, notes }); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const cancelAppointment = createAsyncThunk('appointments/cancel', async (id, { rejectWithValue }) => {
  try { await api.patch(`/appointments/${id}/cancel`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: { list: [], loading: false, error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };
    builder
      .addCase(fetchAllAppointments.pending, pending)
      .addCase(fetchAllAppointments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAllAppointments.rejected, rejected)
      .addCase(fetchDoctorAppointments.pending, pending)
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchDoctorAppointments.rejected, rejected)
      .addCase(fetchPatientAppointments.pending, pending)
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchPatientAppointments.rejected, rejected)
      .addCase(bookAppointment.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex(a => a._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const idx = state.list.findIndex(a => a._id === action.payload);
        if (idx !== -1) state.list[idx].status = 'cancelled';
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;