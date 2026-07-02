const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Ledger = require('../models/Ledger');

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const partyType = req.query.partyType || '';
    const search = req.query.search || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    if (partyType) query.partyType = partyType;
    if (search) query.partyName = { $regex: search, $options: 'i' };

    const total = await Ledger.countDocuments(query);
    const data = await Ledger.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const data = await Ledger.findOne(query);
    if (!data) return res.status(404).json({ success: false, message: 'Ledger not found' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
