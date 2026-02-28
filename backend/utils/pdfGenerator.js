const PDFDocument = require('pdfkit');

const generatePrescriptionPDF = (prescription, patient, doctor) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('ClinicPro - Medical Prescription', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
    doc.text(`Patient: ${patient.name} | Age: ${patient.age} | Gender: ${patient.gender}`);
    doc.text(`Doctor: Dr. ${doctor.name}`);
    doc.moveDown();

    // Diagnosis
    doc.fontSize(14).text('Diagnosis:', { underline: true });
    doc.fontSize(12).text(prescription.diagnosis || 'N/A');
    doc.moveDown();

    // Medicines
    doc.fontSize(14).text('Medicines:', { underline: true });
    prescription.medicines.forEach((med, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${med.name} - ${med.dosage} | ${med.frequency} | ${med.duration}`
      );
      if (med.instructions) doc.text(`   Instructions: ${med.instructions}`);
    });
    doc.moveDown();

    // Notes
    if (prescription.notes) {
      doc.fontSize(14).text('Doctor Notes:', { underline: true });
      doc.fontSize(12).text(prescription.notes);
      doc.moveDown();
    }

    // AI Explanation
    if (prescription.aiExplanation) {
      doc.fontSize(14).text('Prescription Explanation (AI):', { underline: true });
      doc.fontSize(11).text(prescription.aiExplanation);
    }

    doc.end();
  });
};

module.exports = { generatePrescriptionPDF };