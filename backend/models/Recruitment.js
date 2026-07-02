const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  department: { type: String, required: true },
  numberOfVacancies: { type: Number, required: true },
  applicationDeadline: { type: Date, required: true },
  description: { type: String },
  requirements: { type: String },
  salaryRange: { type: String },
  status: { type: String, enum: ['Open', 'Closed', 'On Hold'], default: 'Open' },
  applicants: [{
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    resumeUrl: { type: String },
    appliedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'], default: 'Applied' },
    interviewDate: { type: Date },
    interviewNotes: { type: String }
  }],
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Recruitment', recruitmentSchema);
