const mongoose = require('mongoose');

const grnItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  orderedQty: { type: Number, required: true },
  receivedQty: { type: Number, required: true },
  condition: { type: String, enum: ['Good', 'Damaged', 'Partial'], required: true },
  remarks: { type: String }
});

const grnSchema = new mongoose.Schema({
  grnNumber: { type: String, required: true, unique: true },
  purchaseOrderNo: { type: String, required: true },
  supplierName: { type: String, required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  items: [grnItemSchema],
  warehouseLocation: { type: String, required: true },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receivedDate: { type: Date, required: true },
  invoiceNumber: { type: String },
  invoiceDate: { type: Date },
  totalValue: { type: Number },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('GRN', grnSchema);
