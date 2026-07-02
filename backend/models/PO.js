const mongoose = require('mongoose');

const poSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  poDate: { type: Date, required: true },
  poValue: { type: Number, required: true },
  systemSize: { type: Number, required: true },
  siteLocation: { type: String, required: true },
  specialTerms: { type: String },
  poDocumentUrl: { type: String },
  linkedProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('PO', poSchema);
