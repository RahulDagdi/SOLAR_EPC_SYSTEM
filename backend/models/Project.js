const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  poNumber: { type: String, required: true },
  poValue: { type: Number, required: true },
  systemSize: { type: Number, required: true },
  siteLocation: { type: String, required: true },
  siteAddress: { type: String },
  projectManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  expectedHandoverDate: { type: Date, required: true },
  actualHandoverDate: { type: Date },
  projectStatus: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Not Started'
  },
  currentStage: { 
    type: String, 
    enum: ['Engineering', 'Permits', 'Procurement', 'Civil', 'Installation', 'Testing', 'Net Metering', 'Handover'],
    default: 'Engineering'
  },
  overallProgress: { type: Number, default: 0 },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Project', projectSchema);
