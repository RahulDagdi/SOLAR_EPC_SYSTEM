

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  ClipboardList,
  Package,
  Truck,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Sun,
  Calendar,
  Award,
  GraduationCap,
  Search,
  ShoppingCart,
  Wallet,
  AlertTriangle,
  Receipt,
  BookOpen,
  Shield,
  ChevronRight,
  Globe,
  Map,
  MapPinned,
  Landmark,
  FolderTree,
  Badge,
  Ruler,
  Boxes,
  Hammer,
  CreditCard,
  Percent,
  Milestone,
  CheckSquare,
  MapPin,
  ListChecks,
} from "lucide-react";

const Sidebar = () => {
  const { hasRole, isSuperAdmin } = useAuth();

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'finance_manager', 'project_manager', 'hr_manager', 'sales_executive', 'accountant'] },
      ]
    },

    {
      title: "Masters",

      items: [

        {
          path: "/masters",
          label: "Masters Dashboard",
          icon: FolderTree,
          roles: [
            "super_admin",
            "admin"
          ]
        },

        {
          path: "/masters/countries",
          label: "Country Master",
          icon: Globe,
          roles: [
            "super_admin",
            "admin"
          ]
        },

        {
          path: "/masters/states",
          label: "State Master",
          icon: Map,
          roles: [
            "super_admin",
            "admin"
          ]
        },

        // {
        //   path: "/masters/districts",
        //   label: "District Master",
        //   icon: MapPinned,
        //   roles: [
        //     "super_admin",
        //     "admin"
        //   ]
        // },

        {
          path: "/masters/cities",
          label: "City Master",
          icon: Building2,
          roles: [
            "super_admin",
            "admin"
          ]
        },

        {
          path: "/masters/currencies",
          label: "Currency Master",
          icon: DollarSign,
          roles: [
            "super_admin",
            "admin"
          ]
        },

        {
          path: "/masters/customer-types",
          label: "Customer Type",
          icon: Users,
          roles: [
            "super_admin",
            "admin"
          ]
        },

        {
          path: "/masters/industry-segments",
          label: "Industry Segment",
          icon: Briefcase,
          roles: [
            "super_admin",
            "admin"
          ]
        },

        {
          path: "/masters/msme-status",
          label: "MSME Status",
          icon: Landmark,
          roles: [
            "super_admin",
            "admin"
          ]
        },

        {
          path: "/masters/customer-status",
          label: "Customer Status",
          icon: ClipboardList,
          roles: [
            "super_admin",
            "admin"
          ]
        },
        {
          path: "/masters/departments",
          label: "Department Master",
          icon: Briefcase,
          roles: [
            "super_admin",
            "admin"
          ]
        },

        {
          path: "/masters/designations",
          label: "Designation Master",
          icon: Badge,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/units",
          label: "Unit Master",
          icon: Ruler,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/material-categories",
          label: "Material Category Master",
          icon: Boxes,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/work-types",
          label: "Work Type Master",
          icon: Hammer,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/expense-types",
          label: "Expense Type Master",
          icon: Receipt,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/payment-terms",
          label: "Payment Terms Master",
          icon: CreditCard,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/taxes",
          label: "Tax Master",
          icon: Percent,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/project-stages",
          label: "Project Stage Master",
          icon: Milestone,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/approval-levels",
          label: "Approval Level Master",
          icon: CheckSquare,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/project-sites",
          label: "Project Site Master",
          icon: MapPin,
          roles: ["super_admin", "admin"]
        },

        {
          path: "/masters/boq-items",
          label: "BOQ Item Master",
          icon: ListChecks,
          roles: ["super_admin", "admin"]
        },

      ]
    },

    {
      title: 'HR',
      items: [
        { path: '/hr/employees', label: 'Employee Master', icon: Users, roles: ['super_admin', 'admin', 'hr_manager'] },
        { path: '/hr/attendance', label: 'Attendance & Leave', icon: Calendar, roles: ['super_admin', 'admin', 'hr_manager'] },
        { path: '/hr/payroll', label: 'Payroll', icon: DollarSign, roles: ['super_admin', 'admin', 'hr_manager', 'finance_manager'] },
        { path: '/hr/recruitment', label: 'Recruitment', icon: Search, roles: ['super_admin', 'admin', 'hr_manager'] },
        { path: '/hr/performance', label: 'Performance', icon: Award, roles: ['super_admin', 'admin', 'hr_manager', 'project_manager'] },
        { path: '/hr/training', label: 'Training', icon: GraduationCap, roles: ['super_admin', 'admin', 'hr_manager'] },
      ]
    },

    {
      title: 'Finance & Accounts',
      items: [
        { path: '/finance/budget', label: 'Budget Planning', icon: Wallet, roles: ['super_admin', 'admin', 'finance_manager'] },
        { path: '/finance/pl', label: 'Project P&L', icon: BarChart3, roles: ['super_admin', 'admin', 'finance_manager', 'project_manager'] },
        { path: '/finance/costs', label: 'Cost Management', icon: DollarSign, roles: ['super_admin', 'admin', 'finance_manager', 'project_manager'] },
        { path: '/finance/cashflow', label: 'Cash Flow', icon: Receipt, roles: ['super_admin', 'admin', 'finance_manager'] },
        { path: '/finance/alerts', label: 'Cost Overrun Alerts', icon: AlertTriangle, roles: ['super_admin', 'admin', 'finance_manager', 'project_manager'] },
        { path: '/accounts/invoices', label: 'Invoices', icon: FileText, roles: ['super_admin', 'admin', 'finance_manager', 'accountant'] },
        { path: '/accounts/payments', label: 'Payments', icon: DollarSign, roles: ['super_admin', 'admin', 'finance_manager', 'accountant'] },
        { path: '/accounts/ledger', label: 'Ledger', icon: BookOpen, roles: ['super_admin', 'admin', 'finance_manager', 'accountant'] },
      ]
    },



    {
      title: 'Inventory',
      items: [
        { path: '/inventory/items', label: 'Item Catalogue', icon: Package, roles: ['super_admin', 'admin', 'project_manager'] },
        { path: '/inventory/grn', label: 'GRN', icon: Receipt, roles: ['super_admin', 'admin', 'project_manager'] },
        { path: '/inventory/warehouse', label: 'Warehouse Stock', icon: BookOpen, roles: ['super_admin', 'admin', 'project_manager'] },
        { path: '/inventory/dispatch', label: 'Site Dispatch', icon: Truck, roles: ['super_admin', 'admin', 'project_manager'] },
        { path: '/inventory/consumption', label: 'Consumption Log', icon: BarChart3, roles: ['super_admin', 'admin', 'project_manager', 'site_supervisor'] },
        { path: '/inventory/returns', label: 'Returns Tracker', icon: AlertTriangle, roles: ['super_admin', 'admin', 'project_manager'] },
        { path: '/inventory/contracts', label: 'Annual Contracts', icon: FileText, roles: ['super_admin', 'admin', 'project_manager'] },
      ]
    },
    {
      title: 'Vendors',
      items: [
        { path: '/vendors', label: 'Vendor Register', icon: Users, roles: ['super_admin', 'admin', 'project_manager'] },
        { path: '/vendors/onboarding', label: 'Onboarding', icon: Shield, roles: ['super_admin', 'admin', 'project_manager'] },
        { path: '/vendors/workorders', label: 'Work Orders', icon: Briefcase, roles: ['super_admin', 'admin', 'project_manager'] },
        { path: '/vendors/payments', label: 'Milestone Payments', icon: Wallet, roles: ['super_admin', 'admin', 'finance_manager', 'project_manager'] },
      ]
    },
    {
      title: 'Sales & CRM',
      items: [
        { path: '/sales/clients', label: 'Client Master', icon: Building2, roles: ['super_admin', 'admin', 'sales_executive'] },
        { path: '/sales/leads', label: 'Lead Management', icon: Search, roles: ['super_admin', 'admin', 'sales_executive'] },
        { path: '/sales/quotations', label: 'Quotation Builder', icon: FileText, roles: ['super_admin', 'admin', 'sales_executive'] },
        { path: '/sales/po', label: 'PO Register', icon: ShoppingCart, roles: ['super_admin', 'admin', 'sales_executive'] },
        { path: '/sales/revenue', label: 'Revenue Tracking', icon: DollarSign, roles: ['super_admin', 'admin', 'finance_manager', 'sales_executive'] },
      ]
    },

    {
      title: 'Admin',
      items: [
        { path: '/admin/users', label: 'User Management', icon: Users, roles: ['super_admin', 'admin'] },
        { path: '/admin/roles', label: 'Role Management', icon: Shield, roles: ['admin'] },
        { path: '/admin/audit', label: 'Audit Trail', icon: Shield, roles: ['super_admin', 'admin'] },
        { path: '/admin/settings', label: 'Settings', icon: Settings, roles: ['super_admin'] },
      ]
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sun className="w-8 h-8 text-solar-500" />
          <div>
            <h1 className="text-lg font-bold text-gray-900"> Solar</h1>
            <p className="text-xs text-gray-500">EPC Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuGroups.map((group, idx) => {
          const visibleItems = group.items.filter(item => hasRole(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="mb-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {group.title}
              </p>
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">Version 1.0 | June 2026</p>
      </div>
    </div>
  );
};

export default Sidebar;