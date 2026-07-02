const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Project = require('../models/Project');

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (status) query.projectStatus = status;
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { poNumber: { $regex: search, $options: 'i' } },
        { siteLocation: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Project.countDocuments(query);
    const data = await Project.find(query)
      .populate('clientId', 'clientName clientCode')
      .populate('projectManager', 'name email')
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
    const data = await Project.findOne(query)
      .populate('clientId', 'clientName clientCode email phone')
      .populate('projectManager', 'name email phone');
    if (!data) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', [
  auth,
  body('projectName').notEmpty().withMessage('Project name is required'),
  body('clientId').isMongoId().withMessage('Valid client ID is required'),
  body('poNumber').notEmpty().withMessage('PO number is required'),
  body('poValue').isNumeric().withMessage('PO value must be a number'),
  body('systemSize').isNumeric().withMessage('System size must be a number'),
  body('siteLocation').notEmpty().withMessage('Site location is required'),
  body('projectManager').isMongoId().withMessage('Valid project manager ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('expectedHandoverDate').isISO8601().withMessage('Valid expected handover date is required'),
  validate,
  auditLog('CREATE_PROJECT')
], async (req, res) => {
  try {
    const data = new Project({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Project created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_PROJECT')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Project.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_PROJECT')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Project.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_PROJECTS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Project.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} projects deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/deleted/list', [auth, authorize('super_admin', 'admin')], async (req, res) => {
  try {
    let query = { isDeleted: true };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Project.find(query).populate('clientId', 'clientName');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/restore', [auth, authorize('super_admin', 'admin'), param('id').isMongoId(), validate, auditLog('RESTORE_PROJECT')], async (req, res) => {
  try {
    const data = await Project.findOneAndUpdate({ _id: req.params.id, isDeleted: true }, { isDeleted: false, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project restored', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Dashboard stats
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    const total = await Project.countDocuments(query);
    const active = await Project.countDocuments({ ...query, projectStatus: 'In Progress' });
    const completed = await Project.countDocuments({ ...query, projectStatus: 'Completed' });
    const totalValue = await Project.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$poValue' } } }
    ]);

    const stageData = await Project.aggregate([
      { $match: query },
      { $group: { _id: '$currentStage', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalProjects: total,
        activeProjects: active,
        completedProjects: completed,
        totalPOValue: totalValue[0]?.total || 0,
        stageDistribution: stageData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
