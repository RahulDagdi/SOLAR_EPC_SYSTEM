const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Company = require('./models/Company');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/atpl_solar_epc';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: 'super_admin' });
    if (existingAdmin) {
      console.log('Super Admin already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('You can login with these credentials.');
      process.exit(0);
    }

    // Create default company/organization
    const company = new Company({
      name: 'ATPL Solar EPC Pvt Ltd',
      code: 'ATPL001',
      gstin: 'YOUR_GSTIN_HERE',
      pan: 'YOUR_PAN_HERE',
      address: 'Your Company Address',
      state: 'Your State',
      city: 'Your City',
      pincode: '000000',
      phone: '0000000000',
      email: 'admin@atpl.com'
    });
    await company.save();
    console.log('Default company created:', company.name);

    // Create Super Admin user
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const superAdmin = new User({
      name: 'System Administrator',
      email: 'admin@atpl.com',
      password: hashedPassword,
      role: 'super_admin',
      organizationId: company._id,
      phone: '0000000000',
      isActive: true
    });

    await superAdmin.save();
    console.log('\n✅ Super Admin created successfully!');
    console.log('=====================================');
    console.log('Email:    admin@atpl.com');
    console.log('Password: admin123');
    console.log('Role:     super_admin');
    console.log('=====================================');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('You can now login at: http://localhost:5173');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSuperAdmin();
