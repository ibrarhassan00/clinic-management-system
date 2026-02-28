const { GoogleGenerativeAI } = require('@google/generative-ai');
const DiagnosisLog = require('../models/DiagnosisLog');
const Prescription = require('../models/Prescription');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper - graceful fallback
const safeAI = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('AI Error:', error.message);
    return null; // graceful fallback
  }
};

// Smart Symptom Checker
const symptomChecker = async (req, res) => {
  const { patientId, symptoms, age, gender, history } = req.body;

  const prompt = `You are a medical AI assistant. A patient has the following details:
Age: ${age}, Gender: ${gender}
Symptoms: ${symptoms.join(', ')}
Medical History: ${history || 'None'}

Return a JSON object with:
- conditions: array of {name, probability (low/medium/high), description}
- riskLevel: "low" | "medium" | "high"  
- suggestedTests: array of strings
- advice: string

ONLY return valid JSON, no extra text.`;

  const aiText = await safeAI(prompt);
  let aiResponse;

  if (aiText) {
    try {
      const clean = aiText.replace(/```json|```/g, '').trim();
      aiResponse = JSON.parse(clean);
    } catch {
      aiResponse = { conditions: [], riskLevel: 'medium', suggestedTests: [], advice: 'Please consult your doctor.' };
    }
  } else {
    // Fallback
    aiResponse = { conditions: [], riskLevel: 'medium', suggestedTests: [], advice: 'AI unavailable. Please consult your doctor directly.' };
  }

  // Save to diagnosis log
  const log = await DiagnosisLog.create({
    patient: patientId, doctor: req.user._id,
    symptoms, age, gender, history, aiResponse,
  });

  res.json({ success: true, aiResponse, logId: log._id });
};

// Prescription Explanation for Patient
const explainPrescription = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id).populate('doctor', 'name');
  if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

  const medList = prescription.medicines.map(m => `${m.name} ${m.dosage} ${m.frequency}`).join(', ');

  const prompt = `Explain this prescription in simple, easy-to-understand language for a patient (not a doctor):
Diagnosis: ${prescription.diagnosis}
Medicines: ${medList}
Notes: ${prescription.notes || 'None'}

Include: what each medicine does, lifestyle tips, and preventive advice.
Keep it friendly and under 300 words.`;

  const explanation = await safeAI(prompt);
  
  if (explanation) {
    prescription.aiExplanation = explanation;
    await prescription.save();
    res.json({ success: true, explanation });
  } else {
    res.json({ success: false, explanation: 'AI explanation unavailable. Please ask your doctor to explain your prescription.' });
  }
};

// Risk Flagging
const checkRiskFlags = async (req, res) => {
  const { patientId } = req.params;
  const logs = await DiagnosisLog.find({ patient: patientId }).sort({ createdAt: -1 }).limit(10);

  if (logs.length === 0) return res.json({ flags: [] });

  const allSymptoms = logs.flatMap(l => l.symptoms);
  const symptomCount = {};
  allSymptoms.forEach(s => { symptomCount[s] = (symptomCount[s] || 0) + 1; });
  const repeated = Object.entries(symptomCount).filter(([, count]) => count >= 2).map(([s]) => s);

  const flags = [];
  if (repeated.length > 0) flags.push(`Repeated symptoms: ${repeated.join(', ')}`);
  if (logs.some(l => l.aiResponse?.riskLevel === 'high')) flags.push('High-risk diagnosis detected in history');

  res.json({ flags });
};

module.exports = { symptomChecker, explainPrescription, checkRiskFlags };