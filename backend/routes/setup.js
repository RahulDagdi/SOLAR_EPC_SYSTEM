const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Company = require('../models/Company');

// @route   POST /api/setup/create-super-admin
// @desc    Create first super admin (only works if no super admin exists)
// @access  Public (but only works once)
router.post('/create-super-admin', async (req, res) => {
  try {

    // Check if any super admin already exists

    // const existingAdmin = await User.findOne({ role: 'super_admin' });
    // if (existingAdmin) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Super Admin already exists. Use login instead.'
    //   });
    // }


    // Multiple System Admin ban sakenge , Same email se duplicate account nahi banega
//     const existingUser = await User.findOne({ email });

// if (existingUser) {
//   return res.status(400).json({
//     success: false,
//     message: 'Email already registered'
//   });
// }

    const { name, email, password, companyName, companyCode, gstin, pan, address, state, city } = req.body;




    // Validate required fields
    // if (!name || !email || !password || !companyName || !companyCode) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please provide all required fields: name, email, password, companyName, companyCode'
    //   });
    // }

if (
  !name ||
  !email ||
  !password ||
  !companyName ||
  !companyCode ||
  !gstin ||
  !pan ||
  !address ||
  !state ||
  !city
) {
  return res.status(400).json({
    success: false,
    message: 'All company details are required'
  });
}




    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }



    // Create company
let company = await Company.findOne({
  code: companyCode
});

if (!company) {
  company = new Company({
    name: companyName,
    code: companyCode,
    gstin,
    pan,
    address,
    state,
    city,
    pincode: '000000',
    phone: '',
    email
  });

  await company.save();
}

    // Hash password
    // const salt = await bcrypt.genSalt(12);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create Super Admin
    const superAdmin = new User({
      name,
      email,
      // password: hashedPassword,
      password: password,
      role: 'super_admin',
      organizationId: company._id,
      phone: '',
      isActive: true
    });

    await superAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Super Admin created successfully!',
      data: {
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
        company: company.name
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during setup'
    });
  }
});

// @route   GET /api/setup/check
// @desc    Check if system is already set up
// @access  Public
router.get('/check', async (req, res) => {
  try {
    const superAdmin = await User.findOne({ role: 'super_admin' });
    // res.json({
    //   success: true,
    //   data: {
    //     isSetup: !!superAdmin,
    //     message: superAdmin ? 'System is already set up' : 'System needs setup'
    //   }
    // });

    res.json({
  success: true,
  data: {
    isSetup: false,
    message: 'Setup page always enabled'
  }
});

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
