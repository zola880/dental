const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    name: { type: String, required: [true, 'Service name is required'], unique: true, trim: true },
    description: { type: String, maxlength: 500, trim: true },
    duration: { type: Number, required: [true, 'Duration is required'], min: 5 }, // in minutes
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    category: { type: String, trim: true }, // e.g., 'cleaning', 'surgery', 'orthodontics'
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ name: 1 });
serviceSchema.index({ category: 1 });

module.exports = mongoose.model('Service', serviceSchema);