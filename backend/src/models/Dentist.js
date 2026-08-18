const mongoose = require('mongoose');
const { Schema } = mongoose;

const dentistSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, required: [true, 'Specialization is required'], trim: true },
    licenseNumber: { type: String, required: [true, 'License number is required'], unique: true, trim: true },
    experience: { type: Number, min: 0, default: 0 }, // Years of experience
    bio: { type: String, maxlength: 500, trim: true },
    consultationFee: { type: Number, min: 0, default: 0 },
    isAvailable: { type: Boolean, default: true },
    schedule: {
      // Simplified schedule, can be expanded to complex weekly schedules later
      workingDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
    },
  },
  { timestamps: true }
);

dentistSchema.index({ user: 1 });
dentistSchema.index({ licenseNumber: 1 });

module.exports = mongoose.model('Dentist', dentistSchema);