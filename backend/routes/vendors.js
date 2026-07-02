const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Vendor = require('../models/Vendor');
const WorkOrder = require('../models/WorkOrder');

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || '';
    const status = req.query.status || '';
    const search = req.query.search || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { vendorName: { $regex: search, $options: 'i' } },
        { vendorCode: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Vendor.countDocuments(query);
    const data = await Vendor.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Vendor.findOne(query);
    if (!data) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', [
  auth,
  body('vendorName').notEmpty().withMessage('Vendor name is required'),
  body('vendorCode').notEmpty().withMessage('Vendor code is required'),
  body('category').isIn(['Civil', 'Wiring', 'Mounting', 'Logistics', 'Other']).withMessage('Invalid category'),
  body('contactPerson').notEmpty().withMessage('Contact person is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('address').notEmpty().withMessage('Address is required'),
  validate,
  auditLog('CREATE_VENDOR')
], async (req, res) => {
  try {
    const data = new Vendor({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Vendor created', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Vendor code already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_VENDOR')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Vendor.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, message: 'Vendor updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_VENDOR')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Vendor.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_VENDORS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Vendor.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} vendors deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/deleted/list', [auth, authorize('super_admin', 'admin')], async (req, res) => {
  try {
    let query = { isDeleted: true };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Vendor.find(query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/restore', [auth, authorize('super_admin', 'admin'), param('id').isMongoId(), validate, auditLog('RESTORE_VENDOR')], async (req, res) => {
  try {
    const data = await Vendor.findOneAndUpdate({ _id: req.params.id, isDeleted: true }, { isDeleted: false, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, message: 'Vendor restored', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
