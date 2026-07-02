const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const DPR = require('../models/DPR');

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const projectId = req.query.projectId || '';
    const dateFrom = req.query.dateFrom || '';
    const dateTo = req.query.dateTo || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (projectId) query.projectId = projectId;
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const total = await DPR.countDocuments(query);
    const data = await DPR.find(query)
      .populate('projectId', 'projectName siteLocation')
      .populate('submittedBy', 'name')
      .populate('materialsUsed.itemId', 'itemName')
      .sort({ date: -1 })
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
    const data = await DPR.findOne(query)
      .populate('projectId', 'projectName siteLocation')
      .populate('submittedBy', 'name')
      .populate('materialsUsed.itemId', 'itemName');
    if (!data) return res.status(404).json({ success: false, message: 'DPR not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', [
  auth,
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('workCompletedToday').notEmpty().withMessage('Work completed is required'),
  validate,
  auditLog('CREATE_DPR')
], async (req, res) => {
  try {
    const data = new DPR({
      ...req.body,
      submittedBy: req.user._id,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'DPR submitted', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_DPR')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await DPR.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'DPR not found' });
    res.json({ success: true, message: 'DPR updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_DPR')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await DPR.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'DPR not found' });
    res.json({ success: true, message: 'DPR deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_DPRS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await DPR.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} DPRs deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/deleted/list', [auth, authorize('super_admin', 'admin')], async (req, res) => {
  try {
    let query = { isDeleted: true };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await DPR.find(query).populate('projectId', 'projectName');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/restore', [auth, authorize('super_admin', 'admin'), param('id').isMongoId(), validate, auditLog('RESTORE_DPR')], async (req, res) => {
  try {
    const data = await DPR.findOneAndUpdate({ _id: req.params.id, isDeleted: true }, { isDeleted: false, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'DPR not found' });
    res.json({ success: true, message: 'DPR restored', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
