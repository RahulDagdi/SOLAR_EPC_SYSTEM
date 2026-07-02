const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadName: { type: String, required: true },
  company: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  location: { type: String },
  systemSizeRequired: { type: Number },
  leadSource: { type: String, enum: ['Reference', 'Online', 'Cold Call', 'Walk-in', 'Exhibition'], required: true },
  stage: { 
    type: String, 
    enum: ['First Contact', 'Site Visit', 'Proposal', 'Quote Sent', 'Negotiation', 'Won', 'Lost'],
    default: 'First Contact'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastContactDate: { type: Date, default: Date.now },
  nextFollowUpDate: { type: Date },
  notes: { type: String },
  estimatedValue: { type: Number },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Lead', leadSchema);
