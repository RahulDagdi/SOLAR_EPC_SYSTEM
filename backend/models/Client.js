const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientCode: { type: String, required: true, unique: true },
  clientType: { 
    type: String, 
    enum: ['Industrial', 'Commercial', 'Govt', 'Residential'],
    required: true 
  },
  address: { type: String, required: true },
  gstin: { type: String },
  pan: { type: String },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  paymentTerms: { type: Number, default: 30 },
  creditLimit: { type: Number, default: 0 },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Client', clientSchema);
