const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  taskName: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  stage: { 
    type: String, 
    enum: ['Engineering', 'Permits', 'Procurement', 'Civil', 'Installation', 'Testing', 'Net Metering', 'Handover']
  },
  completedAt: { type: Date },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', taskSchema);
