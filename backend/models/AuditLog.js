const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  action: { type: String, required: true },
  method: { type: String, required: true },
  url: { type: String, required: true },
  ipAddress: { type: String },
  referenceId: { type: String },
  referenceType: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
