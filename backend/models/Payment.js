const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  paymentDate: { type: Date, required: true },
  paymentMode: { type: String, enum: ['NEFT', 'RTGS', 'Cheque', 'UPI', 'Cash', 'Bank Transfer'], required: true },
  amountReceived: { type: Number, required: true },
  bankReferenceNo: { type: String },
  remainingBalance: { type: Number, required: true },
  notes: { type: String },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Payment', paymentSchema);
