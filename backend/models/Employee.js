const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  aadhaar: { type: String },
  pan: { type: String },
  bankAccount: { type: String },
  ifscCode: { type: String },
  bankName: { type: String },
  documents: [{
    documentType: { type: String },
    documentUrl: { type: String },
    uploadDate: { type: Date }
  }],
  basicSalary: { type: Number, default: 0 },
  hra: { type: Number, default: 0 },
  travelAllowance: { type: Number, default: 0 },
  pfAmount: { type: Number, default: 0 },
  esiAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Employee', employeeSchema);
