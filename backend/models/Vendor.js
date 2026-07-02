const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  vendorCode: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Civil', 'Wiring', 'Mounting', 'Logistics', 'Other'],
    required: true 
  },
  gstNumber: { type: String },
  pan: { type: String },
  bankAccountNo: { type: String },
  ifscCode: { type: String },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  status: { type: String, enum: ['Approved', 'Pending', 'Blacklisted'], default: 'Pending' },
  onboardingStatus: {
    businessRegistration: { type: Boolean, default: false },
    gstCertificate: { type: Boolean, default: false },
    panCard: { type: Boolean, default: false },
    bankAccountVerified: { type: Boolean, default: false },
    workSampleSubmitted: { type: Boolean, default: false },
    managerApproval: { type: Boolean, default: false },
    approvalDate: { type: Date }
  },
  performanceRating: {
    qualityRating: { type: Number, default: 0 },
    timelinessRating: { type: Number, default: 0 },
    overallRating: { type: Number, default: 0 },
    totalProjects: { type: Number, default: 0 }
  },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Vendor', vendorSchema);
