const mongoose = require('mongoose');

const paymentMilestoneSchema = new mongoose.Schema({
  milestoneName: { type: String, required: true },
  percentageOfWO: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Verified', 'Approved', 'Paid'], default: 'Pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verificationDate: { type: Date },
  l1Approval: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  l1Approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  l1Date: { type: Date },
  l2Approval: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  l2Approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  l2Date: { type: Date },
  paymentDate: { type: Date },
  paymentMode: { type: String },
  referenceNo: { type: String }
});

const workOrderSchema = new mongoose.Schema({
  woNumber: { type: String, required: true, unique: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  scopeOfWork: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalValue: { type: Number, required: true },
  paymentMilestones: [paymentMilestoneSchema],
  termsConditions: { type: String },
  status: { type: String, enum: ['Draft', 'Issued', 'In Progress', 'Completed', 'Cancelled'], default: 'Draft' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);
