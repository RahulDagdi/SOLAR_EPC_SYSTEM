const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const WorkOrder = require('../models/WorkOrder');

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const projectId = req.query.projectId || '';
    const vendorId = req.query.vendorId || '';
    const status = req.query.status || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (projectId) query.projectId = projectId;
    if (vendorId) query.vendorId = vendorId;
    if (status) query.status = status;

    const total = await WorkOrder.countDocuments(query);
    const data = await WorkOrder.find(query)
      .populate('vendorId', 'vendorName vendorCode')
      .populate('projectId', 'projectName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await WorkOrder.findOne(query)
      .populate('vendorId', 'vendorName vendorCode')
      .populate('projectId', 'projectName');
    if (!data) return res.status(404).json({ success: false, message: 'Work Order not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', [
  auth,
  body('woNumber').notEmpty().withMessage('WO number is required'),
  body('vendorId').isMongoId().withMessage('Valid vendor ID is required'),
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('scopeOfWork').notEmpty().withMessage('Scope of work is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('totalValue').isNumeric().withMessage('Total value must be numeric'),
  validate,
  auditLog('CREATE_WORKORDER')
], async (req, res) => {
  try {
    const data = new WorkOrder({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Work Order created', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'WO number already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_WORKORDER')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await WorkOrder.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Work Order not found' });
    res.json({ success: true, message: 'Work Order updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_WORKORDER')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await WorkOrder.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Work Order not found' });
    res.json({ success: true, message: 'Work Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_WORKORDERS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await WorkOrder.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} work orders deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
