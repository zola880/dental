const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true, enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW'] },
    entity: { type: String, required: true }, // e.g., 'Patient', 'Appointment'
    entityId: { type: Schema.Types.ObjectId },
    metadata: { type: Schema.Types.Mixed }, // Store relevant changes or context
    ipAddress: { type: String, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false } // We use custom 'timestamp' field
);

auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);