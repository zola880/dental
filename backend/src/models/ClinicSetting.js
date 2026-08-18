const mongoose = require('mongoose');
const { Schema } = mongoose;

const clinicSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

clinicSettingSchema.index({ key: 1 });

module.exports = mongoose.model('ClinicSetting', clinicSettingSchema);