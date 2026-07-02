const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  costCategory: { type: String, enum: ['Goods', 'Recurring', 'Pass-Through'], required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  supplierName: { type: String },
  invoiceRef: { type: String },
  costType: { type: String, enum: ['Material', 'Labour', 'Subcontract', 'Overhead', 'Other'] },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Cost', costSchema);
