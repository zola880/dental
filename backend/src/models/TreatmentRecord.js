const mongoose = require('mongoose');
const { Schema } = mongoose;

const treatmentRecordSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    dentist: { type: Schema.Types.ObjectId, ref: 'Dentist', required: true },
    treatment: { type: Schema.Types.ObjectId, ref: 'Treatment' }, // Optional link to a treatment plan
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' }, // Optional link to an appointment
    procedureName: { type: String, required: [true, 'Procedure name is required'], trim: true },
    toothNumber: { type: String, trim: true },
    notes: { type: String, maxlength: 2000, trim: true },
    cost: { type: Number, min: 0, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

treatmentRecordSchema.index({ patient: 1, date: -1 });
treatmentRecordSchema.index({ dentist: 1 });

module.exports = mongoose.model('TreatmentRecord', treatmentRecordSchema);