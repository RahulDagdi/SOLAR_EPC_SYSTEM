const mongoose = require('mongoose');

const dprSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  date: { type: Date, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  manpowerPresent: { type: Number, default: 0 },
  workCompletedToday: { type: String, required: true },
  issuesChallenges: { type: String, default: '' },
  materialsUsed: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number },
    unit: { type: String }
  }],
  weather: { type: String },
  photos: [{ type: String }],
  nextDayPlan: { type: String },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('DPR', dprSchema);
