const mongoose = require('mongoose');

const changeOrderSchema = new mongoose.Schema({
  coNumber: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  description: { type: String, required: true },
  reason: { type: String, required: true },
  costImpact: { type: Number, required: true },
  approvedByClient: { type: Boolean, default: false },
  clientApprovalDate: { type: Date },
  clientApprovalDocument: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Implemented'], default: 'Pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvalDate: { type: Date },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('ChangeOrder', changeOrderSchema);
