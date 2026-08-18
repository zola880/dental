const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    dentist: { type: Schema.Types.ObjectId, ref: 'Dentist', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    startDateTime: { type: Date, required: [true, 'Start date and time are required'] },
    endDateTime: { type: Date, required: [true, 'End date and time are required'] },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled',
    },
    notes: { type: String, maxlength: 1000, trim: true },
    type: { type: String, enum: ['checkup', 'follow_up', 'emergency', 'consultation', 'procedure'], default: 'checkup' },
  },
  { timestamps: true }
);

// Indexes for calendar and schedule queries
appointmentSchema.index({ startDateTime: 1, endDateTime: 1 });
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ dentist: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);