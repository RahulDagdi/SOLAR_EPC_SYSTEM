const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  milestoneName: { type: String, required: true },
  description: { type: String },
  percentageOfPOValue: { type: Number, required: true },
  targetDate: { type: Date, required: true },
  actualCompletionDate: { type: Date },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  autoInvoiceTriggered: { type: Boolean, default: false },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Milestone', milestoneSchema);
