const mongoose = require('mongoose');

const returnsSchema = new mongoose.Schema({
  returnNumber: { type: String, required: true, unique: true },
  returnedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantityReturned: { type: Number, required: true },
  condition: { type: String, enum: ['Good', 'Minor Damage', 'Write-off'], required: true },
  inspectionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inspectionDate: { type: Date },
  status: { type: String, enum: ['Pending Inspection', 'Inspected', 'Added to Stock', 'Disposed'], default: 'Pending Inspection' },
  warehouseLocation: { type: String },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Returns', returnsSchema);
