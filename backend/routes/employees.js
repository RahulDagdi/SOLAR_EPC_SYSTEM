const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');
const Recruitment = require('../models/Recruitment');
const Performance = require('../models/Performance');
const Training = require('../models/Training');

// ==================== EMPLOYEES ====================
router.get('/employees', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const department = req.query.department || '';
    const search = req.query.search || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Employee.countDocuments(query);
    const data = await Employee.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/employees/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Employee.findOne(query);
    if (!data) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/employees', [
  auth, authorize('super_admin', 'admin', 'hr_manager'),
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('dateOfJoining').isISO8601().withMessage('Valid date of joining is required'),
  validate,
  auditLog('CREATE_EMPLOYEE')
], async (req, res) => {
  try {
    const data = new Employee({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Employee created', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Employee ID already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/employees/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_EMPLOYEE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Employee.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, message: 'Employee updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/employees/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_EMPLOYEE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Employee.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/employees/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_EMPLOYEES')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Employee.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} employees deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== ATTENDANCE ====================
router.get('/attendance', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const employeeId = req.query.employeeId || '';
    const dateFrom = req.query.dateFrom || '';
    const dateTo = req.query.dateTo || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (employeeId) query.employeeId = employeeId;
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const total = await Attendance.countDocuments(query);
    const data = await Attendance.find(query).populate('employeeId', 'name employeeId').sort({ date: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/attendance', [
  auth,
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['Present', 'Absent', 'Late', 'Half Day', 'Leave']).withMessage('Invalid status'),
  validate,
  auditLog('CREATE_ATTENDANCE')
], async (req, res) => {
  try {
    const data = new Attendance({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Attendance recorded', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Attendance already exists for this date' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/attendance/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_ATTENDANCE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Attendance.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Attendance record not found' });
    res.json({ success: true, message: 'Attendance updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/attendance/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_ATTENDANCE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Attendance.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Attendance record not found' });
    res.json({ success: true, message: 'Attendance deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/attendance/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_ATTENDANCE')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Attendance.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} attendance records deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== LEAVE ====================
router.get('/leaves', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const employeeId = req.query.employeeId || '';
    const status = req.query.status || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (employeeId) query.employeeId = employeeId;
    if (status) query.status = status;

    const total = await Leave.countDocuments(query);
    const data = await Leave.find(query).populate('employeeId', 'name employeeId').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/leaves', [
  auth,
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('leaveType').isIn(['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave', 'Other']).withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('totalDays').isNumeric().withMessage('Total days must be numeric'),
  body('reason').notEmpty().withMessage('Reason is required'),
  validate,
  auditLog('CREATE_LEAVE')
], async (req, res) => {
  try {
    const data = new Leave({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Leave application submitted', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/leaves/:id/approve', [auth, param('id').isMongoId(), validate, auditLog('APPROVE_LEAVE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Leave.findOneAndUpdate(query, {
      status: 'Approved',
      approvedBy: req.user._id,
      approvalDate: new Date(),
      updatedAt: Date.now()
    }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Leave application not found' });
    res.json({ success: true, message: 'Leave approved', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/leaves/:id/reject', [auth, param('id').isMongoId(), validate, auditLog('REJECT_LEAVE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Leave.findOneAndUpdate(query, {
      status: 'Rejected',
      rejectionReason: req.body.rejectionReason || '',
      updatedAt: Date.now()
    }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Leave application not found' });
    res.json({ success: true, message: 'Leave rejected', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/leaves/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_LEAVE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Leave.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Leave application not found' });
    res.json({ success: true, message: 'Leave deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== PAYROLL ====================
router.get('/payroll', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const employeeId = req.query.employeeId || '';
    const month = req.query.month || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = month;

    const total = await Payroll.countDocuments(query);
    const data = await Payroll.find(query).populate('employeeId', 'name employeeId').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/payroll', [
  auth, authorize('super_admin', 'admin', 'hr_manager', 'finance_manager'),
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('month').notEmpty().withMessage('Month is required'),
  body('year').isNumeric().withMessage('Year must be numeric'),
  body('basicSalary').isNumeric().withMessage('Basic salary must be numeric'),
  body('grossSalary').isNumeric().withMessage('Gross salary must be numeric'),
  body('netPay').isNumeric().withMessage('Net pay must be numeric'),
  body('daysWorked').isNumeric().withMessage('Days worked must be numeric'),
  body('daysInMonth').isNumeric().withMessage('Days in month must be numeric'),
  validate,
  auditLog('CREATE_PAYROLL')
], async (req, res) => {
  try {
    const data = new Payroll({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Payroll created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/payroll/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_PAYROLL')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Payroll.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Payroll record not found' });
    res.json({ success: true, message: 'Payroll updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/payroll/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_PAYROLL')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Payroll.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Payroll record not found' });
    res.json({ success: true, message: 'Payroll deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/payroll/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_PAYROLL')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Payroll.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} payroll records deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== RECRUITMENT ====================
router.get('/recruitment', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const total = await Recruitment.countDocuments(query);
    const data = await Recruitment.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/recruitment', [
  auth, authorize('super_admin', 'admin', 'hr_manager'),
  body('jobTitle').notEmpty().withMessage('Job title is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('numberOfVacancies').isNumeric().withMessage('Number of vacancies must be numeric'),
  body('applicationDeadline').isISO8601().withMessage('Valid deadline is required'),
  validate,
  auditLog('CREATE_RECRUITMENT')
], async (req, res) => {
  try {
    const data = new Recruitment({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Job posting created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/recruitment/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_RECRUITMENT')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Recruitment.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Job posting not found' });
    res.json({ success: true, message: 'Job posting updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/recruitment/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_RECRUITMENT')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Recruitment.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Job posting not found' });
    res.json({ success: true, message: 'Job posting deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/recruitment/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_RECRUITMENT')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Recruitment.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} job postings deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== PERFORMANCE ====================
router.get('/performance', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const employeeId = req.query.employeeId || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (employeeId) query.employeeId = employeeId;

    const total = await Performance.countDocuments(query);
    const data = await Performance.find(query).populate('employeeId', 'name employeeId').populate('reviewerId', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/performance', [
  auth, authorize('super_admin', 'admin', 'hr_manager', 'project_manager'),
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('reviewPeriod').notEmpty().withMessage('Review period is required'),
  body('reviewerId').isMongoId().withMessage('Valid reviewer ID is required'),
  validate,
  auditLog('CREATE_PERFORMANCE')
], async (req, res) => {
  try {
    const data = new Performance({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Performance review created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/performance/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_PERFORMANCE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Performance.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Performance review not found' });
    res.json({ success: true, message: 'Performance review updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/performance/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_PERFORMANCE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Performance.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Performance review not found' });
    res.json({ success: true, message: 'Performance review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/performance/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_PERFORMANCE')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Performance.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} performance reviews deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== TRAINING ====================
router.get('/training', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const total = await Training.countDocuments(query);
    const data = await Training.find(query).populate('enrolledEmployees.employeeId', 'name employeeId').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/training', [
  auth, authorize('super_admin', 'admin', 'hr_manager'),
  body('programName').notEmpty().withMessage('Program name is required'),
  body('type').isIn(['Safety', 'Technical', 'Soft Skills']).withMessage('Invalid training type'),
  body('trainer').notEmpty().withMessage('Trainer is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('duration').isNumeric().withMessage('Duration must be numeric'),
  validate,
  auditLog('CREATE_TRAINING')
], async (req, res) => {
  try {
    const data = new Training({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Training program created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/training/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_TRAINING')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Training.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Training program not found' });
    res.json({ success: true, message: 'Training program updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/training/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_TRAINING')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Training.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Training program not found' });
    res.json({ success: true, message: 'Training program deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/training/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_TRAINING')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Training.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} training programs deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
