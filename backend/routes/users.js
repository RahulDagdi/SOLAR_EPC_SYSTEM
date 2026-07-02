const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const auditLog = require('../middleware/audit');
const User = require('../models/User');
const Company=require("../models/Company");

// Create User
router.post('/', [
  auth,
  authorize('super_admin', 'admin'),

  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password minimum 6 characters'),

  // body('role').isIn([
  //   'admin',
  //   'finance_manager',
  //   'project_manager',
  //   'hr_manager',
  //   'site_supervisor',
  //   'sales_executive',
  //   'accountant',
  //   'vendor'
  // ]).withMessage('Invalid role'),
body('role')
.isIn([
 'super_admin',
 'admin',
 'finance_manager',
 'project_manager',
 'hr_manager',
 'site_supervisor',
 'sales_executive',
 'accountant',
 'vendor'
])
.withMessage('Invalid role'),
  validate,
  auditLog('CREATE_USER')

], async (req, res) => {
   console.log('BODY 45 line =>', req.body);
  try {

   const {
   name,
   email,
   password,
   role,
   companyName,
companyCode,
gstin,
pan,
address,
state,
city
} = req.body;

if (
  req.user.role === 'admin' &&
  role === 'super_admin'
) {
  return res.status(403).json({
    success: false,
    message: 'Admin cannot create Super Admin'
  });
}

// if(req.user.role === 'admin'){

//    const allowedRoles = [
//       'finance_manager',
//       'project_manager',
//       'hr_manager',
//       'site_supervisor',
//       'sales_executive',
//       'accountant',
//       'vendor'
//    ];

//    if(!allowedRoles.includes(role)){

//       return res.status(403).json({
//          success:false,
//          message:'Admin cannot create this role'
//       });

//    }

// }


if (req.user.role === 'admin') {

  const allowedRoles = [
    'finance_manager',
    'project_manager',
    'hr_manager',
    'site_supervisor',
    'sales_executive',
    'accountant',
    'vendor'
  ];

  if (!allowedRoles.includes(role)) {

    return res.status(403).json({
      success: false,
      message: 'Admin can create only department users'
    });

  }

}

    const existingUser = await User.findOne({
      email,
      isDeleted: false
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }


let organizationId=req.user.organizationId;

if(req.user.role==="super_admin"){

  if(

!companyName ||

!companyCode ||

!gstin ||

!pan ||

!address ||

!state ||

!city

){

return res.status(400).json({

success:false,

message:"Please fill all Company Details"

});

}

const existingCompany = await Company.findOne({

$or:[
  {code:companyCode},
{name:companyName}
],
isDeleted:false
});


if(existingCompany){

return res.status(400).json({

success:false,

message:"Company Name or Company Code already exists"

});

}

const company=await Company.create({

name:companyName,

code:companyCode,

gstin,

pan,

address,

state,

city,

pincode:"000000",

createdBy:req.user._id

});

organizationId=company._id;

}








    const user = new User({
      name,
      email,
      password,
      role,

      // organizationId: req.user.organizationId,
  //     organizationId:
  // req.user.role === 'super_admin'
  //   ? req.body.organizationId
  //   : req.user.organizationId,


  organizationId,

createdBy:req.user._id ,
      isActive: true
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error('CREATE USER ERROR =>', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});





// Get all users with pagination, search
router.get('/', [auth, authorize('super_admin', 'admin')], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';

    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') {
      query.organizationId = req.user.organizationId;
    }
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .populate('organizationId', 'name code')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single user
router.get('/:id', [auth, authorize('super_admin', 'admin'), param('id').isMongoId(), validate], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const user = await User.findOne(query).select('-password').populate('organizationId', 'name code');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user
router.put('/:id', [
  auth, authorize('super_admin', 'admin'),
  param('id').isMongoId(), validate,
  auditLog('UPDATE_USER')
], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    const updates = { ...req.body, updatedAt: Date.now() };
    delete updates.password; // Don't update password here

    const user = await User.findOneAndUpdate(query, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Soft delete user
router.delete('/:id', [
  auth, authorize('super_admin', 'admin'),
  param('id').isMongoId(), validate,
  auditLog('DELETE_USER')
], async (req, res) => {
  try {
    let query = { _id: req.params.id, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const user = await User.findOneAndUpdate(query, { isDeleted: true, updatedAt: Date.now() }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Bulk delete users
router.post('/bulk/delete', [
  auth, authorize('super_admin', 'admin'),
  body('ids').isArray({ min: 1 }), validate,
  auditLog('BULK_DELETE_USERS')
], async (req, res) => {
  try {
    let query = { _id: { $in: req.body.ids }, isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;
    const result = await User.updateMany(query, { isDeleted: true, updatedAt: Date.now() });
    res.json({ success: true, message: `${result.modifiedCount} users deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Restore deleted user
router.post('/:id/restore', [
  auth, authorize('super_admin', 'admin'),
  param('id').isMongoId(), validate,
  auditLog('RESTORE_USER')
], async (req, res) => {
  try {

    // const user = await User.findOneAndUpdate(
    //   { _id: req.params.id, isDeleted: true },
    //   { isDeleted: false, updatedAt: Date.now() },
    //   { new: true }
    // ).select('-password');

let query = {
    _id: req.params.id,
    isDeleted: true
};

if (req.user.role !== "super_admin") {
    query.organizationId = req.user.organizationId;
}

const user = await User.findOneAndUpdate(
    query,
    {
        isDeleted: false,
        updatedAt: Date.now()
    },
    {
        new: true
    }
).select("-password");

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User restored', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
