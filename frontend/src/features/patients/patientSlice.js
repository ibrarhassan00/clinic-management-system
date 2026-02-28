import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchPatients = createAsyncThunk('patients/fetchAll', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/receptionist/patients'); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const registerPatient = createAsyncThunk('patients/register', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/receptionist/patients', payload); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updatePatient = createAsyncThunk('patients/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try { const { data } = await api.put(`/receptionist/patients/${id}`, payload); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMyProfile = createAsyncThunk('patients/myProfile', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/patient/profile'); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const patientSlice = createSlice({
  name: 'patients',
  initialState: { list: [], myProfile: null, loading: false, error: null },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => { state.loading = true; })
      .addCase(fetchPatients.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchPatients.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerPatient.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const idx = state.list.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => { state.myProfile = action.payload; });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer;