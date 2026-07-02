const mongoose = require('mongoose');

const paymentApprovalSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  payeeName: { type: String, required: true },
  payeeType: { type: String, enum: ['Vendor', 'Supplier', 'Employee', 'Other'], required: true },
  purpose: { type: String, required: true },
  amount: { type: Number, required: true },
  l1Approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  l1Status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  l1Date: { type: Date },
  l1Comments: { type: String },
  l2Approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  l2Status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  l2Date: { type: Date },
  l2Comments: { type: String },
  finalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Paid'], default: 'Pending' },
  paymentDate: { type: Date },
  paymentMode: { type: String },
  referenceNo: { type: String },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('PaymentApproval', paymentApprovalSchema);
