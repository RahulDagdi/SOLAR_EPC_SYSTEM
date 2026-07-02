const mongoose = require('mongoose');

const budgetLineItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String },
  allocatedAmount: { type: Number, required: true },
  actualAmount: { type: Number, default: 0 },
  variance: { type: Number, default: 0 }
});

const budgetSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  poValue: { type: Number, required: true },
  lineItems: [budgetLineItemSchema],
  materialsBudget: { type: Number, default: 0 },
  labourBudget: { type: Number, default: 0 },
  civilBudget: { type: Number, default: 0 },
  electricalBudget: { type: Number, default: 0 },
  overheadsBudget: { type: Number, default: 0 },
  contingencyAmount: { type: Number, default: 0 },
  totalBudget: { type: Number, required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvalDate: { type: Date },
  status: { type: String, enum: ['Draft', 'Approved', 'Revised'], default: 'Draft' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Budget', budgetSchema);
