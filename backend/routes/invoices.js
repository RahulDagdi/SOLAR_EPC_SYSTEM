const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const Client = require('../models/Client');

// Generate sequential invoice number
const generateInvoiceNumber = async (organizationId) => {
  const lastInvoice = await Invoice.findOne({ organizationId }).sort({ createdAt: -1 });
  const prefix = 'INV';
  const year = new Date().getFullYear();
  const nextNum = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split('-')[2]) + 1 : 1;
  return `${prefix}-${year}-${String(nextNum).padStart(5, '0')}`;
};

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const projectId = req.query.projectId || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (status) query.status = status;
    if (projectId) query.projectId = projectId;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { 'items.description': { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Invoice.countDocuments(query);
    const data = await Invoice.find(query)
      .populate('clientId', 'clientName gstin')
      .populate('projectId', 'projectName')
      .sort({ invoiceDate: -1 })
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
    const data = await Invoice.findOne(query)
      .populate('clientId', 'clientName gstin address')
      .populate('projectId', 'projectName')
      .populate('milestoneId', 'milestoneName');
    if (!data) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', [
  auth,
  authorize('super_admin', 'admin', 'finance_manager', 'accountant'),
  body('clientId').isMongoId().withMessage('Valid client ID is required'),
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('invoiceDate').isISO8601().withMessage('Valid invoice date is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('placeOfSupply').notEmpty().withMessage('Place of supply is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  validate,
  auditLog('CREATE_INVOICE')
], async (req, res) => {
  try {
    const { clientId, projectId, items, placeOfSupply } = req.body;

    // Get client and project details
    const client = await Client.findById(clientId);
    const project = await Project.findById(projectId);
    if (!client || !project) {
      return res.status(400).json({ success: false, message: 'Client or Project not found' });
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(
      req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId
    );

    // Calculate GST
    let subTotal = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    const processedItems = items.map(item => {
      const taxableValue = item.quantity * item.ratePerUnit;
      const gstAmount = (taxableValue * item.gstPercentage) / 100;

      // Determine CGST/SGST or IGST based on state
      const isSameState = true; // Simplified - should check client vs company state
      let cgst = 0, sgst = 0, igst = 0;
      if (isSameState) {
        cgst = gstAmount / 2;
        sgst = gstAmount / 2;
      } else {
        igst = gstAmount;
      }

      subTotal += taxableValue;
      totalCGST += cgst;
      totalSGST += sgst;
      totalIGST += igst;

      return {
        ...item,
        taxableValue,
        cgstAmount: cgst,
        sgstAmount: sgst,
        igstAmount: igst,
        totalAmount: taxableValue + cgst + sgst + igst
      };
    });

    const totalGST = totalCGST + totalSGST + totalIGST;
    const totalInvoiceValue = subTotal + totalGST;

    const invoice = new Invoice({
      invoiceNumber,
      clientId,
      clientGSTIN: client.gstin || '',
      ourGSTIN: process.env.COMPANY_GSTIN || '',
      projectId,
      invoiceDate: req.body.invoiceDate,
      dueDate: req.body.dueDate,
      placeOfSupply,
      items: processedItems,
      subTotal,
      totalCGST,
      totalSGST,
      totalIGST,
      totalGST,
      totalInvoiceValue,
      balanceDue: totalInvoiceValue,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });

    await invoice.save();
    res.status(201).json({ success: true, message: 'Invoice created', data: invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Invoice numbers cannot be edited after creation (GST compliance)
router.put('/:id', [
  auth,
  authorize('super_admin', 'admin', 'finance_manager', 'accountant'),
  param('id').isMongoId(), validate,
  auditLog('UPDATE_INVOICE')
], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    // Prevent invoice number modification
    delete req.body.invoiceNumber;

    const data = await Invoice.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', [
  auth, authorize('super_admin', 'admin'),
  param('id').isMongoId(), validate,
  auditLog('DELETE_INVOICE')
], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Invoice.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/bulk/delete', [auth, authorize('super_admin', 'admin'), body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_INVOICES')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Invoice.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} invoices deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/deleted/list', [auth, authorize('super_admin', 'admin')], async (req, res) => {
  try {
    let query = { isDeleted: true };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Invoice.find(query).populate('clientId', 'clientName');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/restore', [auth, authorize('super_admin', 'admin'), param('id').isMongoId(), validate, auditLog('RESTORE_INVOICE')], async (req, res) => {
  try {
    const data = await Invoice.findOneAndUpdate({ _id: req.params.id, isDeleted: true }, { isDeleted: false, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice restored', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
