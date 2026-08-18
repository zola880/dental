const mongoose = require('mongoose');
const { Schema } = mongoose;

const treatmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    dentist: { type: Schema.Types.ObjectId, ref: 'Dentist', required: true },
    title: { type: String, required: [true, 'Treatment title is required'], trim: true },
    description: { type: String, maxlength: 2000, trim: true },
    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed', 'cancelled'],
      default: 'planned',
    },
    startDate: { type: Date },
    endDate: { type: Date },
    estimatedCost: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

treatmentSchema.index({ patient: 1 });
treatmentSchema.index({ dentist: 1 });
treatmentSchema.index({ status: 1 });

module.exports = mongoose.model('Treatment', treatmentSchema);