import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchPatientPrescriptions = createAsyncThunk('prescriptions/fetchForPatient', async (patientId, { rejectWithValue }) => {
  try { const { data } = await api.get(`/prescriptions/patient/${patientId}`); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMyPrescriptions = createAsyncThunk('prescriptions/fetchMine', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/prescriptions/my'); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createPrescription = createAsyncThunk('prescriptions/create', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/prescriptions', payload); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState: { list: [], loading: false, error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientPrescriptions.pending, (state) => { state.loading = true; })
      .addCase(fetchPatientPrescriptions.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMyPrescriptions.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(createPrescription.fulfilled, (state, action) => { state.list.unshift(action.payload); state.loading = false; });
  },
});

export const { clearError } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;