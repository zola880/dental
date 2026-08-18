const mongoose = require('mongoose');
const { Schema } = mongoose;

const prescriptionSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    dentist: { type: Schema.Types.ObjectId, ref: 'Dentist', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    medications: [
      {
        name: { type: String, required: true, trim: true },
        dosage: { type: String, required: true, trim: true },
        frequency: { type: String, required: true, trim: true },
        duration: { type: String, required: true, trim: true },
        notes: { type: String, trim: true },
      },
    ],
    instructions: { type: String, maxlength: 1000, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

prescriptionSchema.index({ patient: 1, date: -1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);