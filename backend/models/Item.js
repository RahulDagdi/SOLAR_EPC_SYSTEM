const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Panel', 'Inverter', 'Cable', 'BOS', 'Structure', 'Civil Material', 'Electrical', 'Other'],
    required: true 
  },
  unit: { type: String, enum: ['Unit', 'Metre', 'Set', 'Kg', 'Bundle', 'Box'], required: true },
  hsnCode: { type: String, required: true },
  gstPercentage: { type: Number, required: true },
  specifications: { type: String },
  standardRate: { type: Number },
  minStockLevel: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Item', itemSchema);
