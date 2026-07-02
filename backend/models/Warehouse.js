const mongoose = require('mongoose');

const warehouseStockSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  warehouseLocation: { type: String, required: true },
  openingStock: { type: Number, default: 0 },
  totalReceived: { type: Number, default: 0 },
  totalDispatched: { type: Number, default: 0 },
  closingBalance: { type: Number, default: 0 },
  minimumStockLevel: { type: Number, default: 10 },
  alertStatus: { type: String, enum: ['Normal', 'Low', 'Critical'], default: 'Normal' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Warehouse', warehouseStockSchema);
