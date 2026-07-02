const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Milestone = require('../models/Milestone');
const Invoice = require('../models/Invoice');

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const projectId = req.query.projectId || '';
    const status = req.query.status || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;

    const total = await Milestone.countDocuments(query);
    const data = await Milestone.find(query)
      .populate('projectId', 'projectName poValue')
      .populate('invoiceId', 'invoiceNumber status totalInvoiceValue')
      .sort({ targetDate: 1 })
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
    const data = await Milestone.findOne(query).populate('projectId', 'projectName poValue').populate('invoiceId');
    if (!data) return res.status(404).json({ success: false, message: 'Milestone not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', [
  auth,
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('milestoneName').notEmpty().withMessage('Milestone name is required'),
  body('percentageOfPOValue').isNumeric().withMessage('Percentage must be a number'),
  body('targetDate').isISO8601().withMessage('Valid target date is required'),
  validate,
  auditLog('CREATE_MILESTONE')
], async (req, res) => {
  try {
    const data = new Milestone({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Milestone created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_MILESTONE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const updates = { ...req.body, updatedAt: Date.now() };
    if (updates.status === 'Completed' && !updates.actualCompletionDate) updates.actualCompletionDate = new Date();

    const data = await Milestone.findOneAndUpdate(query, updates, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Milestone not found' });

    // Auto-trigger invoice if milestone completed and autoInvoice not triggered
    if (data.status === 'Completed' && !data.autoInvoiceTriggered) {
      // Logic to create invoice would go here
      // For now, just mark it
      data.autoInvoiceTriggered = true;
      await data.save();
    }

    res.json({ success: true, message: 'Milestone updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_MILESTONE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Milestone.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Milestone not found' });
    res.json({ success: true, message: 'Milestone deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_MILESTONES')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Milestone.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} milestones deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/deleted/list', [auth, authorize('super_admin', 'admin')], async (req, res) => {
  try {
    let query = { isDeleted: true };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Milestone.find(query).populate('projectId', 'projectName');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/restore', [auth, authorize('super_admin', 'admin'), param('id').isMongoId(), validate, auditLog('RESTORE_MILESTONE')], async (req, res) => {
  try {
    const data = await Milestone.findOneAndUpdate({ _id: req.params.id, isDeleted: true }, { isDeleted: false, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Milestone not found' });
    res.json({ success: true, message: 'Milestone restored', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
