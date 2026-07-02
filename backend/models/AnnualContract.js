const mongoose = require('mongoose');

const annualContractSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  agreedRate: { type: Number, required: true },
  unit: { type: String, required: true },
  contractStartDate: { type: Date, required: true },
  contractEndDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Expired', 'Renewed'], default: 'Active' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('AnnualContract', annualContractSchema);
