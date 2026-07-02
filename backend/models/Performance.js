const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  reviewPeriod: { type: String, required: true },
  goals: [{
    goalDescription: { type: String, required: true },
    targetDate: { type: Date },
    achievementStatus: { type: String, enum: ['Not Started', 'In Progress', 'Achieved', 'Missed'], default: 'Not Started' }
  }],
  ratings: {
    qualityOfWork: { type: Number, min: 1, max: 5 },
    punctuality: { type: Number, min: 1, max: 5 },
    teamwork: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    overallRating: { type: Number, min: 1, max: 5 }
  },
  comments: { type: String },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewDate: { type: Date, default: Date.now },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Performance', performanceSchema);
