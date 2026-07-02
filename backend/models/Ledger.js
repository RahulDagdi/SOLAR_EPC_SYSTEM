const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  partyId: { type: mongoose.Schema.Types.ObjectId, required: true },
  partyType: { type: String, enum: ['Client', 'Vendor'], required: true },
  partyName: { type: String, required: true },
  transactions: [{
    date: { type: Date, required: true },
    description: { type: String, required: true },
    referenceType: { type: String, enum: ['Invoice', 'Payment', 'Credit Note', 'Debit Note'] },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceNumber: { type: String },
    debitAmount: { type: Number, default: 0 },
    creditAmount: { type: Number, default: 0 },
    runningBalance: { type: Number, required: true }
  }],
  currentBalance: { type: Number, default: 0 },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Ledger', ledgerSchema);
