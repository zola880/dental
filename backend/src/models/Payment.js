const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: [true, 'Payment amount is required'], min: 0.01 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'insurance', 'other'],
      required: true,
    },
    transactionId: { type: String, trim: true },
    notes: { type: String, maxlength: 500, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

paymentSchema.index({ invoice: 1 });
paymentSchema.index({ date: -1 });

module.exports = mongoose.model('Payment', paymentSchema);