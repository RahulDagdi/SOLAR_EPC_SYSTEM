const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  hsnCode: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  ratePerUnit: { type: Number, required: true },
  taxableValue: { type: Number, required: true },
  gstPercentage: { type: Number, required: true },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  clientGSTIN: { type: String, required: true },
  ourGSTIN: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  placeOfSupply: { type: String, required: true },
  items: [invoiceItemSchema],
  subTotal: { type: Number, required: true },
  totalCGST: { type: Number, default: 0 },
  totalSGST: { type: Number, default: 0 },
  totalIGST: { type: Number, default: 0 },
  totalGST: { type: Number, required: true },
  totalInvoiceValue: { type: Number, required: true },
  amountReceived: { type: Number, default: 0 },
  balanceDue: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Sent', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled'], default: 'Draft' },
  pdfUrl: { type: String },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
