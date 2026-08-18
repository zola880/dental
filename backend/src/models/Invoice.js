const mongoose = require('mongoose');
const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    items: [
      {
        description: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        total: { type: Number, required: true, min: 0 },
      },
    ],
    subtotal: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, min: 0, default: 0 },
    tax: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0, default: 0 },
    paidAmount: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'pending', 'partially_paid', 'paid', 'cancelled'],
      default: 'draft',
    },
    dueDate: { type: Date },
    notes: { type: String, maxlength: 1000, trim: true },
  },
  { timestamps: true }
);

// Auto-calculate totals before saving
invoiceSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.totalAmount = this.subtotal - this.discount + this.tax;
  
  // Auto-update status based on paid amount
  if (this.paidAmount >= this.totalAmount && this.totalAmount > 0) {
    this.status = 'paid';
  } else if (this.paidAmount > 0 && this.paidAmount < this.totalAmount) {
    this.status = 'partially_paid';
  } else if (this.status !== 'cancelled' && this.status !== 'draft') {
    this.status = 'pending';
  }
  
  next();
});

invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ patient: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);