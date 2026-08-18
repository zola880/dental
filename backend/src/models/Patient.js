const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'], trim: true },
    lastName: { type: String, required: [true, 'Last name is required'], trim: true },
    dateOfBirth: { type: Date, required: [true, 'Date of birth is required'] },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    phone: { type: String, required: [true, 'Phone number is required'], unique: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'], default: 'Unknown' },
    allergies: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for full name
patientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for search performance
patientSchema.index({ phone: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ lastName: 1, firstName: 1 });

module.exports = mongoose.model('Patient', patientSchema);