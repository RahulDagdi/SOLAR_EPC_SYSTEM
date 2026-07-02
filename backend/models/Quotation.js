const mongoose = require('mongoose');

const quotationLineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const quotationSchema = new mongoose.Schema({
  quoteNumber: { type: String, required: true, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  systemSize: { type: Number, required: true },
  panelType: { type: String },
  inverterType: { type: String },
  installationType: { type: String, enum: ['Rooftop', 'Ground'], required: true },
  state: { type: String, required: true },
  lineItems: [quotationLineItemSchema],
  equipmentCost: { type: Number, required: true },
  civilCost: { type: Number, required: true },
  electricalCost: { type: Number, required: true },
  commissionCharges: { type: Number, default: 0 },
  taxes: { type: Number, required: true },
  totalQuoteValue: { type: Number, required: true },
  validityDate: { type: Date, required: true },
  status: { type: String, enum: ['Draft', 'Sent', 'Approved', 'Rejected', 'Expired'], default: 'Draft' },
  pdfUrl: { type: String },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Quotation', quotationSchema);
