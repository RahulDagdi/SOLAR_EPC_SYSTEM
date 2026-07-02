const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Budget = require('../models/Budget');
const Cost = require('../models/Cost');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');

// ==================== BUDGET PLANNING ====================
router.get('/budget', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const projectId = req.query.projectId || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (projectId) query.projectId = projectId;

    const total = await Budget.countDocuments(query);
    const data = await Budget.find(query)
      .populate('projectId', 'projectName poValue')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/budget/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Budget.findOne(query).populate('projectId', 'projectName poValue').populate('approvedBy', 'name');
    if (!data) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/budget', [
  auth, authorize('super_admin', 'admin', 'finance_manager'),
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('poValue').isNumeric().withMessage('PO value must be numeric'),
  body('totalBudget').isNumeric().withMessage('Total budget must be numeric'),
  validate,
  auditLog('CREATE_BUDGET')
], async (req, res) => {
  try {
    const data = new Budget({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Budget created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/budget/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_BUDGET')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Budget.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, message: 'Budget updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/budget/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_BUDGET')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Budget.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/budget/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_BUDGETS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Budget.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} budgets deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== COST MANAGEMENT ====================
router.get('/costs', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const projectId = req.query.projectId || '';
    const costCategory = req.query.costCategory || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (projectId) query.projectId = projectId;
    if (costCategory) query.costCategory = costCategory;

    const total = await Cost.countDocuments(query);
    const data = await Cost.find(query)
      .populate('projectId', 'projectName')
      .populate('vendorId', 'vendorName')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/costs/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Cost.findOne(query).populate('projectId', 'projectName').populate('vendorId', 'vendorName');
    if (!data) return res.status(404).json({ success: false, message: 'Cost record not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/costs', [
  auth, authorize('super_admin', 'admin', 'finance_manager', 'project_manager'),
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('costCategory').isIn(['Goods', 'Recurring', 'Pass-Through']).withMessage('Invalid cost category'),
  body('description').notEmpty().withMessage('Description is required'),
  body('amount').isNumeric().withMessage('Amount must be numeric'),
  body('date').isISO8601().withMessage('Valid date is required'),
  validate,
  auditLog('CREATE_COST')
], async (req, res) => {
  try {
    const data = new Cost({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Cost recorded', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/costs/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_COST')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Cost.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Cost record not found' });
    res.json({ success: true, message: 'Cost updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/costs/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_COST')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Cost.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Cost record not found' });
    res.json({ success: true, message: 'Cost deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/costs/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_COSTS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Cost.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} costs deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== PROJECT P&L ====================
router.get('/project-pl/:projectId', auth, async (req, res) => {
  try {
    let query = { _id: req.params.projectId, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    const project = await Project.findOne(query);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Total revenue from invoices
    const invoices = await Invoice.find({ projectId: req.params.projectId, isDeleted: false });
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amountReceived, 0);
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalInvoiceValue, 0);

    // Total costs
    const costs = await Cost.find({ projectId: req.params.projectId, isDeleted: false });
    const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);

    const grossProfit = totalRevenue - totalCosts;
    const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        projectId: project._id,
        projectName: project.projectName,
        poValue: project.poValue,
        totalRevenue,
        totalInvoiced,
        totalCosts,
        grossProfit,
        grossMargin: parseFloat(grossMargin),
        costBreakdown: costs.reduce((acc, cost) => {
          acc[cost.costCategory] = (acc[cost.costCategory] || 0) + cost.amount;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== CASH FLOW ====================
router.get('/cash-flow', auth, async (req, res) => {
  try {
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    // Get upcoming payments from milestones
    const upcomingInvoices = await Invoice.find({
      ...query,
      status: { $in: ['Sent', 'Partially Paid', 'Overdue'] },
      dueDate: { $gte: new Date() }
    }).sort({ dueDate: 1 }).limit(20);

    // Get upcoming vendor payments from work orders
    const upcomingPayments = [];

    // Calculate 30, 60, 90 day projections
    const now = new Date();
    const projections = {
      '30_days': { inflow: 0, outflow: 0 },
      '60_days': { inflow: 0, outflow: 0 },
      '90_days': { inflow: 0, outflow: 0 }
    };

    upcomingInvoices.forEach(inv => {
      const daysDiff = Math.ceil((inv.dueDate - now) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 30) projections['30_days'].inflow += inv.balanceDue;
      else if (daysDiff <= 60) projections['60_days'].inflow += inv.balanceDue;
      else if (daysDiff <= 90) projections['90_days'].inflow += inv.balanceDue;
    });

    res.json({
      success: true,
      data: {
        upcomingInvoices,
        upcomingPayments,
        projections,
        openingBalance: 0, // Should come from actual bank balance
        projectedClosing30: projections['30_days'].inflow - projections['30_days'].outflow,
        projectedClosing60: projections['60_days'].inflow - projections['60_days'].outflow,
        projectedClosing90: projections['90_days'].inflow - projections['90_days'].outflow
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== COST OVERRUN ALERTS ====================
router.get('/overrun-alerts', auth, async (req, res) => {
  try {
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    const budgets = await Budget.find({ ...query, status: 'Approved' }).populate('projectId', 'projectName');
    const alerts = [];

    for (const budget of budgets) {
      const costs = await Cost.find({ projectId: budget.projectId, isDeleted: false });
      const totalActualCost = costs.reduce((sum, cost) => sum + cost.amount, 0);

      if (totalActualCost > budget.totalBudget) {
        const overrun = totalActualCost - budget.totalBudget;
        const overrunPercent = ((overrun / budget.totalBudget) * 100).toFixed(2);
        alerts.push({
          projectId: budget.projectId._id,
          projectName: budget.projectId.projectName,
          budgetAmount: budget.totalBudget,
          actualCost: totalActualCost,
          overrunAmount: overrun,
          overrunPercent: parseFloat(overrunPercent),
          alertDate: new Date()
        });
      }
    }

    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
