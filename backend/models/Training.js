const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  programName: { type: String, required: true },
  type: { type: String, enum: ['Safety', 'Technical', 'Soft Skills'], required: true },
  description: { type: String },
  trainer: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  enrolledEmployees: [{
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    status: { type: String, enum: ['Enrolled', 'In Progress', 'Completed', 'Dropped'], default: 'Enrolled' },
    completionDate: { type: Date },
    certificateUrl: { type: String }
  }],
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Training', trainingSchema);
