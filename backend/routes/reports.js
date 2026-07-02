const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Cost = require('../models/Cost');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Lead = require('../models/Lead');

// Dashboard Overview Stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    const totalProjects = await Project.countDocuments(query);
    const activeProjects = await Project.countDocuments({ ...query, projectStatus: 'In Progress' });
    const completedProjects = await Project.countDocuments({ ...query, projectStatus: 'Completed' });

    const totalInvoices = await Invoice.countDocuments(query);
    const paidInvoices = await Invoice.countDocuments({ ...query, status: 'Paid' });
    const overdueInvoices = await Invoice.countDocuments({ ...query, status: 'Overdue' });

    const totalEmployees = await Employee.countDocuments(query);
    const activeEmployees = await Employee.countDocuments({ ...query, isActive: true });

    const totalLeads = await Lead.countDocuments(query);
    const wonLeads = await Lead.countDocuments({ ...query, stage: 'Won' });

    // Revenue stats
    const revenueData = await Invoice.aggregate([
      { $match: { ...query, status: { $in: ['Paid', 'Partially Paid'] } } },
      { $group: { _id: null, total: { $sum: '$amountReceived' } } }
    ]);

    // Cost stats
    const costData = await Cost.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalRevenue = revenueData[0]?.total || 0;
    const totalCosts = costData[0]?.total || 0;

    res.json({
      success: true,
      data: {
        projects: { total: totalProjects, active: activeProjects, completed: completedProjects },
        invoices: { total: totalInvoices, paid: paidInvoices, overdue: overdueInvoices },
        employees: { total: totalEmployees, active: activeEmployees },
        leads: { total: totalLeads, won: wonLeads },
        financial: { totalRevenue, totalCosts, netProfit: totalRevenue - totalCosts }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Project Stage Distribution
router.get('/project-stages', auth, async (req, res) => {
  try {
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    const stageData = await Project.aggregate([
      { $match: query },
      { $group: { _id: '$currentStage', count: { $sum: 1 }, value: { $sum: '$poValue' } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, data: stageData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Monthly Revenue Chart
router.get('/monthly-revenue', auth, async (req, res) => {
  try {
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    const year = parseInt(req.query.year) || new Date().getFullYear();
    const monthlyData = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const revenue = await Invoice.aggregate([
        { $match: { ...query, invoiceDate: { $gte: startDate, $lte: endDate }, status: { $in: ['Paid', 'Partially Paid'] } } },
        { $group: { _id: null, total: { $sum: '$amountReceived' } } }
      ]);

      const costs = await Cost.aggregate([
        { $match: { ...query, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      monthlyData.push({
        month: month + 1,
        monthName: startDate.toLocaleString('default', { month: 'short' }),
        revenue: revenue[0]?.total || 0,
        costs: costs[0]?.total || 0,
        profit: (revenue[0]?.total || 0) - (costs[0]?.total || 0)
      });
    }

    res.json({ success: true, data: monthlyData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Lead Conversion Funnel
router.get('/lead-funnel', auth, async (req, res) => {
  try {
    let query = { isDeleted: false };
    if (req.user.role !== 'super_admin') query.organizationId = req.user.organizationId;

    const funnelData = await Lead.aggregate([
      { $match: query },
      { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$estimatedValue' } } }
    ]);

    res.json({ success: true, data: funnelData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
