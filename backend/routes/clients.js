const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const Client = require('../models/Client');

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const clientType = req.query.clientType || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (clientType) query.clientType = clientType;
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientCode: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Client.countDocuments(query);
    const data = await Client.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', [auth, param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Client.findOne(query);
    if (!data) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



router.post('/', [
  auth,
  body('clientName').notEmpty().withMessage('Client name is required'),
  body('clientCode').notEmpty().withMessage('Client code is required'),
  body('clientType').isIn(['Industrial', 'Commercial', 'Govt', 'Residential']).withMessage('Invalid client type'),
  body('address').notEmpty().withMessage('Address is required'),
  body('contactPerson').notEmpty().withMessage('Contact person is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  validate,
  auditLog('CREATE_CLIENT')
], async (req, res) => {
  try {
     console.log('USER =>', req.user);
    console.log('BODY =>', req.body);
   const data = new Client({
  ...req.body,
  organizationId:
    req.body.organizationId || req.user.organizationId,
  createdBy: req.user._id
});
    await data.save();
    res.status(201).json({ success: true, message: 'Client created', data });
  }

  //  catch (error) {
  //   if (error.code === 11000) return res.status(400).json({ success: false, message: 'Client code already exists' });
  //   res.status(500).json({ success: false, message: 'Server error' });
  // }
  catch (error) {
  console.error('CLIENT CREATE ERROR =>', error);

  if (error.code === 11000)
    return res.status(400).json({
      success: false,
      message: 'Client code already exists'
    });

  res.status(500).json({
    success: false,
    message: error.message
  });
}

});


router.put('/:id', [auth, param('id').isMongoId(), validate, auditLog('UPDATE_CLIENT')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Client.findOneAndUpdate(query, { ...req.body, updatedAt: Date.now() }, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, message: 'Client updated', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', [auth, param('id').isMongoId(), validate, auditLog('DELETE_CLIENT')], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Client.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/bulk/delete', [auth, body('ids').isArray({ min: 1 }), validate, auditLog('BULK_DELETE_CLIENTS')], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await Client.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} clients deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/deleted/list', [auth, authorize('super_admin', 'admin')], async (req, res) => {
  try {
    let query = { isDeleted: true };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Client.find(query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/:id/restore', [auth, authorize('super_admin', 'admin'), param('id').isMongoId(), validate, auditLog('RESTORE_CLIENT')], async (req, res) => {
  try {
    const data = await Client.findOneAndUpdate({ _id: req.params.id, isDeleted: true }, { isDeleted: false, updatedAt: Date.now() }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, message: 'Client restored', data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
