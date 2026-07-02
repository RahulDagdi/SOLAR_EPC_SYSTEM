const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const invoiceId = req.query.invoiceId || '';
    const clientId = req.query.clientId || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (invoiceId) query.invoiceId = invoiceId;
    if (clientId) query.clientId = clientId;

    const total = await Payment.countDocuments(query);
    const data = await Payment.find(query)
      .populate('invoiceId', 'invoiceNumber totalInvoiceValue')
      .populate('clientId', 'clientName')
      .sort({ paymentDate: -1 })
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
    const data = await Payment.findOne(query).populate('invoiceId').populate('clientId', 'clientName');
    if (!data) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', [
  auth,
  authorize('super_admin', 'admin', 'finance_manager', 'accountant'),
  body('invoiceId').isMongoId().withMessage('Valid invoice ID is required'),
  body('clientId').isMongoId().withMessage('Valid client ID is required'),
  body('paymentDate').isISO8601().withMessage('Valid payment date is required'),
  body('paymentMode').isIn(['NEFT', 'RTGS', 'Cheque', 'UPI', 'Cash', 'Bank Transfer']).withMessage('Invalid payment mode'),
  body('amountReceived').isNumeric().withMessage('Amount must be a number'),
  validate,
  auditLog('CREATE_PAYMENT')
], async (req, res) => {
  try {
    const { invoiceId, amountReceived } = req.body;

    // Get invoice and update balance
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const newBalance = invoice.balanceDue - amountReceived;
    const newStatus = newBalance <= 0 ? 'Paid' : (newBalance < invoice.totalInvoiceValue ? 'Partially Paid' : invoice.status);

    await Invoice.findByIdAndUpdate(invoiceId, {
      amountReceived: invoice.amountReceived + amountReceived,
      balanceDue: newBalance,
      status: newStatus,
      updatedAt: Date.now()
    });

    const payment = new Payment({
      ...req.body,
      remainingBalance: newBalance,
      receiptNumber: `RCP-${Date.now()}`,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });

    await payment.save();
    res.status(201).json({ success: true, message: 'Payment recorded', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_PAYMENT')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Payment.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, message: 'Payment updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_PAYMENT')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Payment.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_PAYMENTS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Payment.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} payments deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/deleted/list', [auth, authorize('super_admin', 'admin')], async (req, res) => {
  try {
    let query = { isDeleted: true };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Payment.find(query).populate('invoiceId', 'invoiceNumber').populate('clientId', 'clientName');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/restore', [auth, authorize('super_admin', 'admin'), param('id').isMongoId(), validate, auditLog('RESTORE_PAYMENT')], async (req, res) => {
  try {
    const data = await Payment.findOneAndUpdate({ _id: req.params.id, isDeleted: true }, { isDeleted: false, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, message: 'Payment restored', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
