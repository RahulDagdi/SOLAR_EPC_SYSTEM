const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Item = require('../models/Item');
const GRN = require('../models/GRN');
const Warehouse = require('../models/Warehouse');
const Dispatch = require('../models/Dispatch');
const Consumption = require('../models/Consumption');
const Returns = require('../models/Returns');
const AnnualContract = require('../models/AnnualContract');

// ==================== ITEMS ====================
router.get('/items', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || '';
    const search = req.query.search || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { itemCode: { $regex: search, $options: 'i' } },
        { hsnCode: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Item.countDocuments(query);
    const data = await Item.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/items/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Item.findOne(query);
    if (!data) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/items', [
  auth,
  body('itemCode').notEmpty().withMessage('Item code is required'),
  body('itemName').notEmpty().withMessage('Item name is required'),
  body('category').isIn(['Panel', 'Inverter', 'Cable', 'BOS', 'Structure', 'Civil Material', 'Electrical', 'Other']).withMessage('Invalid category'),
  body('unit').isIn(['Unit', 'Metre', 'Set', 'Kg', 'Bundle', 'Box']).withMessage('Invalid unit'),
  body('hsnCode').notEmpty().withMessage('HSN code is required'),
  body('gstPercentage').isNumeric().withMessage('GST percentage must be numeric'),
  validate,
  auditLog('CREATE_ITEM')
], async (req, res) => {
  try {
    const data = new Item({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Item created', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Item code already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/items/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_ITEM')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Item.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/items/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_ITEM')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Item.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/items/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_ITEMS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Item.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} items deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== GRN ====================
router.get('/grn', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const total = await GRN.countDocuments(query);
    const data = await GRN.find(query).populate('items.itemId', 'itemName').sort({ receivedDate: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/grn/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await GRN.findOne(query).populate('items.itemId', 'itemName');
    if (!data) return res.status(404).json({ success: false, message: 'GRN not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/grn', [
  auth,
  body('grnNumber').notEmpty().withMessage('GRN number is required'),
  body('purchaseOrderNo').notEmpty().withMessage('PO number is required'),
  body('supplierName').notEmpty().withMessage('Supplier name is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('warehouseLocation').notEmpty().withMessage('Warehouse location is required'),
  body('receivedDate').isISO8601().withMessage('Valid received date is required'),
  validate,
  auditLog('CREATE_GRN')
], async (req, res) => {
  try {
    const data = new GRN({
      ...req.body,
      receivedBy: req.user._id,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'GRN created', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'GRN number already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/grn/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_GRN')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await GRN.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'GRN not found' });
    res.json({ success: true, message: 'GRN updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/grn/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_GRN')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await GRN.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'GRN not found' });
    res.json({ success: true, message: 'GRN deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/grn/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_GRNS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await GRN.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} GRNs deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== WAREHOUSE STOCK ====================
router.get('/warehouse', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const total = await Warehouse.countDocuments(query);
    const data = await Warehouse.find(query).populate('itemId', 'itemName itemCode category').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/warehouse/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Warehouse.findOne(query).populate('itemId', 'itemName itemCode');
    if (!data) return res.status(404).json({ success: false, message: 'Stock record not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/warehouse/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_WAREHOUSE')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Warehouse.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Stock record not found' });
    res.json({ success: true, message: 'Stock updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== DISPATCH ====================
router.get('/dispatch', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const total = await Dispatch.countDocuments(query);
    const data = await Dispatch.find(query).populate('dispatchedTo', 'projectName').populate('items.itemId', 'itemName').sort({ dispatchDate: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/dispatch/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Dispatch.findOne(query).populate('dispatchedTo', 'projectName').populate('items.itemId', 'itemName');
    if (!data) return res.status(404).json({ success: false, message: 'Dispatch not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/dispatch', [
  auth,
  body('challanNumber').notEmpty().withMessage('Challan number is required'),
  body('dispatchedFrom').notEmpty().withMessage('Dispatched from is required'),
  body('dispatchedTo').isMongoId().withMessage('Valid project ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('dispatchDate').isISO8601().withMessage('Valid dispatch date is required'),
  validate,
  auditLog('CREATE_DISPATCH')
], async (req, res) => {
  try {
    const data = new Dispatch({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Dispatch created', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Challan number already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/dispatch/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_DISPATCH')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Dispatch.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Dispatch not found' });
    res.json({ success: true, message: 'Dispatch updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/dispatch/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_DISPATCH')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Dispatch.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Dispatch not found' });
    res.json({ success: true, message: 'Dispatch deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/dispatch/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_DISPATCHES')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Dispatch.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} dispatches deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== CONSUMPTION ====================
router.get('/consumption', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const total = await Consumption.countDocuments(query);
    const data = await Consumption.find(query).populate('projectId', 'projectName').populate('itemId', 'itemName').sort({ date: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/consumption', [
  auth,
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('itemId').isMongoId().withMessage('Valid item ID is required'),
  body('quantityUsed').isNumeric().withMessage('Quantity must be numeric'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  validate,
  auditLog('CREATE_CONSUMPTION')
], async (req, res) => {
  try {
    const data = new Consumption({
      ...req.body,
      loggedBy: req.user._id,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Consumption logged', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== RETURNS ====================
router.get('/returns', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const total = await Returns.countDocuments(query);
    const data = await Returns.find(query).populate('returnedFrom', 'projectName').populate('itemId', 'itemName').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/returns', [
  auth,
  body('returnNumber').notEmpty().withMessage('Return number is required'),
  body('returnedFrom').isMongoId().withMessage('Valid project ID is required'),
  body('itemId').isMongoId().withMessage('Valid item ID is required'),
  body('quantityReturned').isNumeric().withMessage('Quantity must be numeric'),
  body('condition').isIn(['Good', 'Minor Damage', 'Write-off']).withMessage('Invalid condition'),
  validate,
  auditLog('CREATE_RETURN')
], async (req, res) => {
  try {
    const data = new Returns({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Return recorded', data });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Return number already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== ANNUAL CONTRACTS ====================
router.get('/contracts', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const total = await AnnualContract.countDocuments(query);
    const data = await AnnualContract.find(query).populate('itemId', 'itemName').populate('supplierId', 'vendorName').sort({ contractStartDate: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/contracts', [
  auth,
  body('supplierName').notEmpty().withMessage('Supplier name is required'),
  body('itemId').isMongoId().withMessage('Valid item ID is required'),
  body('agreedRate').isNumeric().withMessage('Agreed rate must be numeric'),
  body('contractStartDate').isISO8601().withMessage('Valid start date is required'),
  body('contractEndDate').isISO8601().withMessage('Valid end date is required'),
  validate,
  auditLog('CREATE_CONTRACT')
], async (req, res) => {
  try {
    const data = new AnnualContract({
      ...req.body,
      organizationId: req.user.role === 'super_admin' ? req.body.organizationId : req.user.organizationId,
      createdBy: req.user._id
    });
    await data.save();
    res.status(201).json({ success: true, message: 'Contract created', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
