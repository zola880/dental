const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    category: {
      type: String,
      enum: ['supplies', 'rent', 'utilities', 'salary', 'marketing', 'maintenance', 'other'],
      required: true,
    },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
    date: { type: Date, default: Date.now },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

expenseSchema.index({ category: 1 });
expenseSchema.index({ date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);