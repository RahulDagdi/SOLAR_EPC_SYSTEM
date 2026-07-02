const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  basicSalary: { type: Number, required: true },
  hra: { type: Number, default: 0 },
  travelAllowance: { type: Number, default: 0 },
  otherAllowances: { type: Number, default: 0 },
  grossSalary: { type: Number, required: true },
  pfDeduction: { type: Number, default: 0 },
  esiDeduction: { type: Number, default: 0 },
  tdsDeduction: { type: Number, default: 0 },
  otherDeductions: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  daysWorked: { type: Number, required: true },
  daysInMonth: { type: Number, required: true },
  payslipGenerated: { type: Boolean, default: false },
  payslipUrl: { type: String },
  paymentStatus: { type: String, enum: ['Pending', 'Processed', 'Paid'], default: 'Pending' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Payroll', payrollSchema);
