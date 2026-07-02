const mongoose = require('mongoose');

const dispatchItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }
});

const dispatchSchema = new mongoose.Schema({
  challanNumber: { type: String, required: true, unique: true },
  dispatchedFrom: { type: String, required: true },
  dispatchedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  vehicleNumber: { type: String },
  driverName: { type: String },
  items: [dispatchItemSchema],
  dispatchDate: { type: Date, required: true },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receivedDate: { type: Date },
  status: { type: String, enum: ['Dispatched', 'In Transit', 'Received'], default: 'Dispatched' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Dispatch', dispatchSchema);
