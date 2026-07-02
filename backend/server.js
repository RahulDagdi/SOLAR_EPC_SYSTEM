// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const connectDB = require('./config/db');

// // Import routes
// const authRoutes = require('./routes/auth');
// const setupRoutes = require('./routes/setup');
// const userRoutes = require('./routes/users');
// const roleRoutes=require("./routes/roles");
// const clientRoutes = require('./routes/clients');
// const projectRoutes = require('./routes/projects');
// const taskRoutes = require('./routes/tasks');
// const milestoneRoutes = require('./routes/milestones');
// const dprRoutes = require('./routes/dpr');
// const invoiceRoutes = require('./routes/invoices');
// const paymentRoutes = require('./routes/payments');
// const ledgerRoutes = require('./routes/ledger');
// const inventoryRoutes = require('./routes/inventory');
// const vendorRoutes = require('./routes/vendors');
// const workOrderRoutes = require('./routes/workorders');
// const hrRoutes = require('./routes/employees');
// const salesRoutes = require('./routes/sales');
// const financeRoutes = require('./routes/finance');
// const reportRoutes = require('./routes/reports');
// const auditRoutes = require('./routes/audit');
// const organizationRoutes = require('./routes/organizations');


// // ==============================
// // Masters Routes
// // ==============================

// const countryRoutes = require("./routes/masters-old/country");
// const stateRoutes = require("./routes/masters-old/state");
// const districtRoutes = require("./routes/masters-old/district");
// const cityRoutes = require("./routes/masters-old/city");
// const currencyRoutes = require("./routes/masters-old/currency");
// const customerTypeRoutes = require("./routes/masters-old/customerType");
// const industrySegmentRoutes = require("./routes/masters-old/industrySegment");
// const msmeStatusRoutes = require("./routes/masters-old/msmeStatus");
// const customerStatusRoutes = require("./routes/masters-old/customerStatus");
// const departmentRoutes = require("./routes/masters-old/department");

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // limit each IP to 1000 requests per windowMs
//   message: { success: false, message: 'Too many requests, please try again later' }
// });
// app.use('/api/', limiter);

// // Body parsing
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Logging
// app.use(morgan('dev'));

// // Static files for uploads
// app.use('/uploads', express.static('uploads'));

// // API Routes
// app.use('/api/setup', setupRoutes); // Setup route (no auth needed for first time)
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use("/api/roles",roleRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/milestones', milestoneRoutes);
// app.use('/api/dpr', dprRoutes);
// app.use('/api/invoices', invoiceRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/ledger', ledgerRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/vendors', vendorRoutes);
// app.use('/api/workorders', workOrderRoutes);
// app.use('/api/hr', hrRoutes);
// app.use('/api/sales', salesRoutes);
// app.use('/api/finance', financeRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/audit', auditRoutes);
// app.use('/api/organizations', organizationRoutes);
// app.use('/api/company', require('./routes/company'));


// // ======================================
// // Master APIs
// // ======================================

// app.use("/api/masters/countries", countryRoutes);

// app.use("/api/masters/states", stateRoutes);

// app.use("/api/masters/districts", districtRoutes);

// app.use("/api/masters/cities", cityRoutes);

// app.use("/api/masters/currencies", currencyRoutes);

// app.use("/api/masters/customer-types", customerTypeRoutes);

// app.use("/api/masters/industry-segments", industrySegmentRoutes);

// app.use("/api/masters/msme-status", msmeStatusRoutes);

// app.use("/api/masters/customer-status", customerStatusRoutes);
// app.use("/api/masters/departments", departmentRoutes);


// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'API endpoint not found' });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
// });

// module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const setupRoutes = require('./routes/setup');
const userRoutes = require('./routes/users');
const roleRoutes=require("./routes/roles");
const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const milestoneRoutes = require('./routes/milestones');
const dprRoutes = require('./routes/dpr');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const ledgerRoutes = require('./routes/ledger');
const inventoryRoutes = require('./routes/inventory');
const vendorRoutes = require('./routes/vendors');
const workOrderRoutes = require('./routes/workorders');
const hrRoutes = require('./routes/employees');
const salesRoutes = require('./routes/sales');
const financeRoutes = require('./routes/finance');
const reportRoutes = require('./routes/reports');
const auditRoutes = require('./routes/audit');
const organizationRoutes = require('./routes/organizations');


// ==============================
// Masters Routes
// ==============================

const countryRoutes = require("./routes/masters/country");
const stateRoutes = require("./routes/masters/state");
const districtRoutes = require("./routes/masters/district");
const cityRoutes = require("./routes/masters/city");
const currencyRoutes = require("./routes/masters/currency");
const customerTypeRoutes = require("./routes/masters/customerType");
const industrySegmentRoutes = require("./routes/masters/industrySegment");
const msmeStatusRoutes = require("./routes/masters/msmeStatus");
const customerStatusRoutes = require("./routes/masters/customerStatus");
const departmentRoutes = require("./routes/masters/department");
const designationRoutes = require("./routes/masters/designations");
const unitRoutes = require("./routes/masters/units");
const materialCategoryRoutes = require("./routes/masters/materialCategories");
const workTypeRoutes = require("./routes/masters/workTypes");
const expenseTypeRoutes = require("./routes/masters/expenseTypes");
const paymentTermsRoutes = require("./routes/masters/paymentTerms");
const taxRoutes = require("./routes/masters/tax");
const projectStageRoutes = require("./routes/masters/projectStage");
const approvalLevelRoutes = require("./routes/masters/approvalLevel");
const projectSiteRoutes = require("./routes/masters/projectSite");
const boqItemRoutes = require("./routes/masters/boqItem");

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use(morgan('dev'));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/setup', setupRoutes); // Setup route (no auth needed for first time)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/roles",roleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/dpr', dprRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/workorders', workOrderRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/company', require('./routes/company'));


// ======================================
// Master APIs
// ======================================

app.use("/api/masters/countries", countryRoutes);

app.use("/api/masters/states", stateRoutes);

app.use("/api/masters/districts", districtRoutes);

app.use("/api/masters/cities", cityRoutes);

app.use("/api/masters/currencies", currencyRoutes);

app.use("/api/masters/customer-types", customerTypeRoutes);

app.use("/api/masters/industry-segments", industrySegmentRoutes);

app.use("/api/masters/msme-status", msmeStatusRoutes);

app.use("/api/masters/customer-status", customerStatusRoutes);
app.use("/api/masters/departments", departmentRoutes);

app.use("/api/masters/designations", designationRoutes);

app.use("/api/masters/units", unitRoutes);

app.use("/api/masters/material-categories", materialCategoryRoutes);

app.use("/api/masters/work-types", workTypeRoutes);

app.use("/api/masters/expense-types", expenseTypeRoutes);

app.use("/api/masters/payment-terms", paymentTermsRoutes);

app.use("/api/masters/taxes", taxRoutes);

app.use("/api/masters/project-stages", projectStageRoutes);

app.use("/api/masters/approval-levels", approvalLevelRoutes);

app.use("/api/masters/project-sites", projectSiteRoutes);

app.use("/api/masters/boq-items", boqItemRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;