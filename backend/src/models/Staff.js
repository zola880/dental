const mongoose = require('mongoose');
const { Schema } = mongoose;

const staffSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    position: { type: String, required: [true, 'Position is required'], trim: true },
    department: { type: String, trim: true },
    joinDate: { type: Date, default: Date.now },
    salary: { type: Number, min: 0 },
  },
  { timestamps: true }
);

staffSchema.index({ user: 1 });

module.exports = mongoose.model('Staff', staffSchema);