const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Lead = require('../models/Lead');
const Quotation = require('../models/Quotation');
const PO = require('../models/PO');
const Invoice = require('../models/Invoice');

// ==================== LEADS ====================
router.get('/leads', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const stage = req.query.stage || '';
    const assignedTo = req.query.assignedTo || '';
    const search = req.query.search || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (stage) query.stage = stage;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { leadName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Lead.countDocuments(query);
    const data = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/leads/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Lead.findOne(query).populate('assignedTo', 'name email');
    if (!data) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/leads', [
  auth, authorize('super_admin', 'admin', 'sales_executive'),
  body('leadName').notEmpty().withMessage('Lead name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('leadSource').isIn(['Reference', 'Online', 'Cold Call', 'Walk-in', 'Exhibition']).withMessage('Invalid lead source'),
  body('assignedTo').isMongoId().withMessage('Valid assigned user ID is required'),
  validate,
  auditLog('CREATE_LEAD')
], async (req, res) => {
  try {
    const data = new Lead({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Lead created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/leads/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_LEAD')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Lead.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/leads/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_LEAD')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Lead.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/leads/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_LEADS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Lead.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} leads deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== QUOTATIONS ====================
router.get('/quotations', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const clientId = req.query.clientId || '';
    const status = req.query.status || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (clientId) query.clientId = clientId;
    if (status) query.status = status;

    const total = await Quotation.countDocuments(query);
    const data = await Quotation.find(query)
      .populate('clientId', 'clientName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/quotations/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Quotation.findOne(query).populate('clientId', 'clientName');
    if (!data) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/quotations', [
  auth, authorize('super_admin', 'admin', 'sales_executive'),
  body('quoteNumber').notEmpty().withMessage('Quote number is required'),
  body('clientId').isMongoId().withMessage('Valid client ID is required'),
  body('systemSize').isNumeric().withMessage('System size must be numeric'),
  body('installationType').isIn(['Rooftop', 'Ground']).withMessage('Invalid installation type'),
  body('state').notEmpty().withMessage('State is required'),
  body('equipmentCost').isNumeric().withMessage('Equipment cost must be numeric'),
  body('civilCost').isNumeric().withMessage('Civil cost must be numeric'),
  body('electricalCost').isNumeric().withMessage('Electrical cost must be numeric'),
  body('taxes').isNumeric().withMessage('Taxes must be numeric'),
  body('totalQuoteValue').isNumeric().withMessage('Total quote value must be numeric'),
  body('validityDate').isISO8601().withMessage('Valid validity date is required'),
  validate,
  auditLog('CREATE_QUOTATION')
], async (req, res) => {
  try {
    const data = new Quotation({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Quotation created', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Quote number already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/quotations/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_QUOTATION')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Quotation.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, message: 'Quotation updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/quotations/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_QUOTATION')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Quotation.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, message: 'Quotation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/quotations/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_QUOTATIONS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Quotation.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} quotations deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== PO REGISTER ====================
router.get('/po', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const clientId = req.query.clientId || '';
    const status = req.query.status || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (clientId) query.clientId = clientId;
    if (status) query.status = status;

    const total = await PO.countDocuments(query);
    const data = await PO.find(query)
      .populate('clientId', 'clientName')
      .populate('linkedProjectId', 'projectName')
      .sort({ poDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/po/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await PO.findOne(query).populate('clientId', 'clientName').populate('linkedProjectId', 'projectName');
    if (!data) return res.status(404).json({ success: false, message: 'PO not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/po', [
  auth, authorize('super_admin', 'admin', 'sales_executive'),
  body('poNumber').notEmpty().withMessage('PO number is required'),
  body('clientId').isMongoId().withMessage('Valid client ID is required'),
  body('poDate').isISO8601().withMessage('Valid PO date is required'),
  body('poValue').isNumeric().withMessage('PO value must be numeric'),
  body('systemSize').isNumeric().withMessage('System size must be numeric'),
  body('siteLocation').notEmpty().withMessage('Site location is required'),
  validate,
  auditLog('CREATE_PO')
], async (req, res) => {
  try {
    const data = new PO({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'PO registered', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'PO number already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/po/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_PO')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await PO.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'PO not found' });
    res.json({ success: true, message: 'PO updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/po/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_PO')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await PO.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'PO not found' });
    res.json({ success: true, message: 'PO deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/po/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_POS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await PO.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} POs deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Revenue Tracking
router.get('/revenue', auth, async (req, res) => {
  try {
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    const year = parseInt(req.query.year) || new Date().getFullYear();
    const monthlyRevenue = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const invoices = await Invoice.find({
        ...query,
        invoiceDate: { $gte: startDate, $lte: endDate },
        status: { $in: ['Paid', 'Partially Paid'] }
      });

      const revenue = invoices.reduce((sum, inv) => sum + inv.amountReceived, 0);
      const target = 1000000; // Default monthly target - should come from settings

      monthlyRevenue.push({
        month,
        monthName: startDate.toLocaleString('default', { month: 'short' }),
        revenueTarget: target,
        actualRevenue: revenue,
        achievement: target > 0 ? ((revenue / target) * 100).toFixed(2) : 0
      });
    }

    // Pipeline value from active leads
    const pipelineLeads = await Lead.find({
      ...query,
      stage: { $in: ['Proposal', 'Quote Sent', 'Negotiation'] }
    });
    const pipelineValue = pipelineLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

    res.json({
      success: true,
      data: {
        monthlyRevenue,
        totalRevenue: monthlyRevenue.reduce((sum, m) => sum + m.actualRevenue, 0),
        totalTarget: monthlyRevenue.reduce((sum, m) => sum + m.revenueTarget, 0),
        pipelineValue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
