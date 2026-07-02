import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Zap, Shield, BarChart3, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-solar-50">
      {/* Navbar */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="w-8 h-8 text-solar-500" />
          <span className="text-xl font-bold text-gray-900">ATPL Solar</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-solar-100 text-solar-700 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              EPC Management System v1.0
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Complete Solar EPC
              <span className="text-solar-500"> Management</span>
              <br />Platform
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              One integrated platform for managing your entire solar EPC business — from lead generation 
              and project execution to finance, HR, inventory, and vendor management.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-primary text-lg px-8 py-3">
                Get Started
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-solar-400 rounded-3xl opacity-20 blur-3xl"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 rounded-xl p-4">
                  <BarChart3 className="w-8 h-8 text-primary-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Project Analytics</h3>
                  <p className="text-sm text-gray-500">Real-time tracking</p>
                </div>
                <div className="bg-solar-50 rounded-xl p-4">
                  <Users className="w-8 h-8 text-solar-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Team Management</h3>
                  <p className="text-sm text-gray-500">HR & Payroll</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <Shield className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">GST Compliance</h3>
                  <p className="text-sm text-gray-500">Auto invoicing</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <Zap className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Inventory</h3>
                  <p className="text-sm text-gray-500">Stock tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          7 Integrated Modules
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, title: 'Human Resources', desc: 'Employees, Attendance, Payroll, Training' },
            { icon: BarChart3, title: 'Finance', desc: 'Budget, P&L, Cash Flow, Cost Management' },
            { icon: Shield, title: 'Accounts', desc: 'GST Invoices, Payments, Ledger, Approvals' },
            { icon: Zap, title: 'Projects', desc: '8-Stage Tracker, Tasks, DPR, Milestones' },
            { icon: Zap, title: 'Inventory', desc: 'GRN, Warehouse, Dispatch, Consumption' },
            { icon: Users, title: 'Vendors', desc: 'Onboarding, Work Orders, Payments' },
            { icon: BarChart3, title: 'Sales', desc: 'Leads, Quotations, POs, Revenue' },
          ].map((feature, idx) => (
            <div key={idx} className="card hover:shadow-md transition-shadow">
              <feature.icon className="w-10 h-10 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          ATPL Solar EPC Management System | Version 1.0 | June 2026
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
