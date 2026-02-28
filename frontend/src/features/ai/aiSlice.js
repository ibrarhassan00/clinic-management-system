import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const runSymptomChecker = createAsyncThunk('ai/symptomCheck', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/ai/symptoms', payload); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const explainPrescription = createAsyncThunk('ai/explain', async (id, { rejectWithValue }) => {
  try { const { data } = await api.get(`/ai/explain/${id}`); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const checkRiskFlags = createAsyncThunk('ai/riskFlags', async (patientId, { rejectWithValue }) => {
  try { const { data } = await api.get(`/ai/risk/${patientId}`); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const aiSlice = createSlice({
  name: 'ai',
  initialState: { symptomResult: null, explanation: null, riskFlags: [], loading: false, error: null },
  reducers: { clearAI: (state) => { state.symptomResult = null; state.explanation = null; state.riskFlags = []; state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(runSymptomChecker.pending, (state) => { state.loading = true; state.symptomResult = null; })
      .addCase(runSymptomChecker.fulfilled, (state, action) => { state.loading = false; state.symptomResult = action.payload.aiResponse; })
      .addCase(runSymptomChecker.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(explainPrescription.pending, (state) => { state.loading = true; })
      .addCase(explainPrescription.fulfilled, (state, action) => { state.loading = false; state.explanation = action.payload.explanation; })
      .addCase(checkRiskFlags.fulfilled, (state, action) => { state.riskFlags = action.payload.flags; });
  },
});

export const { clearAI } = aiSlice.actions;
export default aiSlice.reducer;