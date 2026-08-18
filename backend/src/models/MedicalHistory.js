const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicalHistorySchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    type: { type: String, enum: ['medical', 'dental'], required: true },
    condition: { type: String, required: [true, 'Condition is required'], trim: true },
    notes: { type: String, maxlength: 1000, trim: true },
    diagnosedDate: { type: Date },
    dentist: { type: Schema.Types.ObjectId, ref: 'Dentist' },
  },
  { timestamps: true }
);

medicalHistorySchema.index({ patient: 1, type: 1 });

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);