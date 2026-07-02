// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import Layout from './components/Layout';

// // Auth Pages
// import LandingPage from './pages/Auth/LandingPage';
// import Login from './pages/Auth/Login';
// import ForgotPassword from './pages/Auth/ForgotPassword';
// import Setup from './pages/Auth/Setup';

// // Dashboard
// import MainDashboard from './pages/Dashboard/MainDashboard';

// // Masters
// import MastersDashboard from "./pages/Masters/MastersDashboard";
// import CountryMaster from "./pages/Masters/CountryMaster";
// import StateMaster from "./pages/Masters/StateMaster";
// import DistrictMaster from "./pages/Masters/DistrictMaster";
// import CityMaster from "./pages/Masters/CityMaster";
// import CurrencyMaster from "./pages/Masters/CurrencyMaster";
// import CustomerTypeMaster from "./pages/Masters/CustomerTypeMaster";
// import IndustrySegmentMaster from "./pages/Masters/IndustrySegmentMaster";
// import MSMEStatusMaster from "./pages/Masters/MSMEStatusMaster";
// import CustomerStatusMaster from "./pages/Masters/CustomerStatusMaster";
// import DepartmentMaster from "./pages/Masters/DepartmentMaster";

// // Role Management
// import RoleManagement from "./pages/Admin/RoleManagement";

// // Sales
// import ClientMaster from './pages/Sales/ClientMaster';
// import LeadManagement from './pages/Sales/LeadManagement';
// import QuotationBuilder from './pages/Sales/QuotationBuilder';
// import PORegister from './pages/Sales/PORegister';
// import RevenueTracking from './pages/Sales/RevenueTracking';

// // Projects
// import ProjectSetup from './pages/Projects/ProjectSetup';
// import StageTracker from './pages/Projects/StageTracker';
// import TaskBoard from './pages/Projects/TaskBoard';
// import DPR from './pages/Projects/DPR';
// import Milestones from './pages/Projects/Milestones';

// // Inventory
// import ItemCatalogue from './pages/Inventory/ItemCatalogue';
// import GRN from './pages/Inventory/GRN';
// import WarehouseStock from './pages/Inventory/WarehouseStock';
// import SiteDispatch from './pages/Inventory/SiteDispatch';
// import ConsumptionLog from './pages/Inventory/ConsumptionLog';
// import ReturnsTracker from './pages/Inventory/ReturnsTracker';
// import AnnualContracts from './pages/Inventory/AnnualContracts';

// // Vendors
// import VendorRegister from './pages/Vendors/VendorRegister';
// import VendorOnboarding from './pages/Vendors/VendorOnboarding';
// import WorkOrders from './pages/Vendors/WorkOrders';
// import MilestonePayments from './pages/Vendors/MilestonePayments';

// // HR
// import EmployeeMaster from './pages/HR/EmployeeMaster';
// import AttendanceLeave from './pages/HR/AttendanceLeave';
// import Payroll from './pages/HR/Payroll';
// import Recruitment from './pages/HR/Recruitment';
// import Performance from './pages/HR/Performance';
// import Training from './pages/HR/Training';

// // Finance
// import BudgetPlanning from './pages/Finance/BudgetPlanning';
// import ProjectPL from './pages/Finance/ProjectPL';
// import CostManagement from './pages/Finance/CostManagement';
// import CashFlow from './pages/Finance/CashFlow';
// import CostOverrunAlerts from './pages/Finance/CostOverrunAlerts';

// // Accounts
// import InvoiceManagement from './pages/Accounts/InvoiceManagement';
// import PaymentReceipts from './pages/Accounts/PaymentReceipts';
// import LedgerManagement from './pages/Accounts/LedgerManagement';
// import PaymentApprovals from './pages/Accounts/PaymentApprovals';

// // Admin
// import UserManagement from './pages/Admin/UserManagement';
// import AuditTrail from './pages/Admin/AuditTrail';

// // Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// const App = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/setup" element={<Setup />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />

//       {/* Protected Routes */}
//       <Route path="/" element={
//         <ProtectedRoute>
//           <Layout />
//         </ProtectedRoute>
//       }>
//         {/* Dashboard */}
//         <Route path="dashboard" element={<MainDashboard />} />

// {/* Masters */}

// <Route path="masters" element={<MastersDashboard />} />
// <Route path="masters/countries" element={<CountryMaster />} />
// <Route path="masters/states" element={<StateMaster />} />
// <Route path="masters/districts" element={<DistrictMaster />} />
// <Route path="masters/cities" element={<CityMaster />} />
// <Route path="masters/currencies" element={<CurrencyMaster />} />
// <Route path="masters/customer-types" element={<CustomerTypeMaster />} />
// <Route path="masters/industry-segments" element={<IndustrySegmentMaster />} />
// <Route path="masters/msme-status" element={<MSMEStatusMaster />} />
// <Route path="masters/customer-status" element={<CustomerStatusMaster />} />
// <Route path="masters/departments" element={<DepartmentMaster />}/>

//         {/* Sales */}
//         <Route path="sales/clients" element={<ClientMaster />} />
//         <Route path="sales/leads" element={<LeadManagement />} />
//         <Route path="sales/quotations" element={<QuotationBuilder />} />
//         <Route path="sales/po" element={<PORegister />} />
//         <Route path="sales/revenue" element={<RevenueTracking />} />

//         {/* Projects */}
//         <Route path="projects" element={<ProjectSetup />} />
//         <Route path="projects/stages" element={<StageTracker />} />
//         <Route path="projects/tasks" element={<TaskBoard />} />
//         <Route path="projects/dpr" element={<DPR />} />
//         <Route path="projects/milestones" element={<Milestones />} />

//         {/* Inventory */}
//         <Route path="inventory/items" element={<ItemCatalogue />} />
//         <Route path="inventory/grn" element={<GRN />} />
//         <Route path="inventory/warehouse" element={<WarehouseStock />} />
//         <Route path="inventory/dispatch" element={<SiteDispatch />} />
//         <Route path="inventory/consumption" element={<ConsumptionLog />} />
//         <Route path="inventory/returns" element={<ReturnsTracker />} />
//         <Route path="inventory/contracts" element={<AnnualContracts />} />

//         {/* Vendors */}
//         <Route path="vendors" element={<VendorRegister />} />
//         <Route path="vendors/onboarding" element={<VendorOnboarding />} />
//         <Route path="vendors/workorders" element={<WorkOrders />} />
//         <Route path="vendors/payments" element={<MilestonePayments />} />

//         {/* HR */}
//         <Route path="hr/employees" element={<EmployeeMaster />} />
//         <Route path="hr/attendance" element={<AttendanceLeave />} />
//         <Route path="hr/payroll" element={<Payroll />} />
//         <Route path="hr/recruitment" element={<Recruitment />} />
//         <Route path="hr/performance" element={<Performance />} />
//         <Route path="hr/training" element={<Training />} />

//         {/* Finance */}
//         <Route path="finance/budget" element={<BudgetPlanning />} />
//         <Route path="finance/pl" element={<ProjectPL />} />
//         <Route path="finance/costs" element={<CostManagement />} />
//         <Route path="finance/cashflow" element={<CashFlow />} />
//         <Route path="finance/alerts" element={<CostOverrunAlerts />} />

//         {/* Accounts */}
//         <Route path="accounts/invoices" element={<InvoiceManagement />} />
//         <Route path="accounts/payments" element={<PaymentReceipts />} />
//         <Route path="accounts/ledger" element={<LedgerManagement />} />
//         <Route path="accounts/approvals" element={<PaymentApprovals />} />

//         {/* Admin */}
//         <Route path="admin/users" element={
//           <ProtectedRoute allowedRoles={['super_admin' ,'admin']}>
//             <UserManagement />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/roles" element={<RoleManagement/>} />
//         <Route path="admin/audit" element={<AuditTrail />} />
//         <Route path="admin/settings" element={<div className="card p-8 text-center text-gray-500">Settings page coming soon</div>} />
//       </Route>

//       {/* Catch all */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// };

// export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Auth Pages
import LandingPage from './pages/Auth/LandingPage';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Setup from './pages/Auth/Setup';

// Dashboard
import MainDashboard from './pages/Dashboard/MainDashboard';

// Masters
import MastersDashboard from "./pages/Masters/MastersDashboard";
import CountryMaster from "./pages/Masters/CountryMaster";
import StateMaster from "./pages/Masters/StateMaster";
import DistrictMaster from "./pages/Masters/DistrictMaster";
import CityMaster from "./pages/Masters/CityMaster";
import CurrencyMaster from "./pages/Masters/CurrencyMaster";
import CustomerTypeMaster from "./pages/Masters/CustomerTypeMaster";
import IndustrySegmentMaster from "./pages/Masters/IndustrySegmentMaster";
import MSMEStatusMaster from "./pages/Masters/MSMEStatusMaster";
import CustomerStatusMaster from "./pages/Masters/CustomerStatusMaster";
import DepartmentMaster from "./pages/Masters/DepartmentMaster";
import DesignationMaster from "./pages/Masters/DesignationMaster";
import UnitMaster from "./pages/Masters/UnitMaster";
import MaterialCategoryMaster from "./pages/Masters/MaterialCategoryMaster";
import WorkTypeMaster from "./pages/Masters/WorkTypeMaster";
import ExpenseTypeMaster from "./pages/Masters/ExpenseTypeMaster";
import PaymentTermsMaster from "./pages/Masters/PaymentTermsMaster";
import TaxMaster from "./pages/Masters/TaxMaster";
import ProjectStageMaster from "./pages/Masters/ProjectStageMaster";
import ApprovalLevelMaster from "./pages/Masters/ApprovalLevelMaster";
import ProjectSiteMaster from "./pages/Masters/ProjectSiteMaster";
import BOQItemMaster from "./pages/Masters/BOQItemMaster";
import CustomerMaster from "./pages/Masters/CustomerMaster";
import SupplierMaster from "./pages/Masters/SupplierMaster";
import VendorMaster from "./pages/Masters/VendorMaster";
import EmployeeMasterPage from "./pages/Masters/EmployeeMasterPage";
import ProjectMasterPage from "./pages/Masters/ProjectMasterPage";
import RolesMasterPage from "./pages/Masters/RolesMasterPage";

// Role Management
import RoleManagement from "./pages/Admin/RoleManagement";

// Sales
import ClientMaster from './pages/Sales/ClientMaster';
import LeadManagement from './pages/Sales/LeadManagement';
import QuotationBuilder from './pages/Sales/QuotationBuilder';
import PORegister from './pages/Sales/PORegister';
import RevenueTracking from './pages/Sales/RevenueTracking';

// Projects
import ProjectSetup from './pages/Projects/ProjectSetup';
import StageTracker from './pages/Projects/StageTracker';
import TaskBoard from './pages/Projects/TaskBoard';
import DPR from './pages/Projects/DPR';
import Milestones from './pages/Projects/Milestones';

// Inventory
import ItemCatalogue from './pages/Inventory/ItemCatalogue';
import GRN from './pages/Inventory/GRN';
import WarehouseStock from './pages/Inventory/WarehouseStock';
import SiteDispatch from './pages/Inventory/SiteDispatch';
import ConsumptionLog from './pages/Inventory/ConsumptionLog';
import ReturnsTracker from './pages/Inventory/ReturnsTracker';
import AnnualContracts from './pages/Inventory/AnnualContracts';

// Vendors
import VendorRegister from './pages/Vendors/VendorRegister';
import VendorOnboarding from './pages/Vendors/VendorOnboarding';
import WorkOrders from './pages/Vendors/WorkOrders';
import MilestonePayments from './pages/Vendors/MilestonePayments';

// HR
import EmployeeMaster from './pages/HR/EmployeeMaster';
import AttendanceLeave from './pages/HR/AttendanceLeave';
import Payroll from './pages/HR/Payroll';
import Recruitment from './pages/HR/Recruitment';
import Performance from './pages/HR/Performance';
import Training from './pages/HR/Training';

// Finance
import BudgetPlanning from './pages/Finance/BudgetPlanning';
import ProjectPL from './pages/Finance/ProjectPL';
import CostManagement from './pages/Finance/CostManagement';
import CashFlow from './pages/Finance/CashFlow';
import CostOverrunAlerts from './pages/Finance/CostOverrunAlerts';

// Accounts
import InvoiceManagement from './pages/Accounts/InvoiceManagement';
import PaymentReceipts from './pages/Accounts/PaymentReceipts';
import LedgerManagement from './pages/Accounts/LedgerManagement';
import PaymentApprovals from './pages/Accounts/PaymentApprovals';

// Admin
import UserManagement from './pages/Admin/UserManagement';
import AuditTrail from './pages/Admin/AuditTrail';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* Dashboard */}
        <Route path="dashboard" element={<MainDashboard />} />

{/* Masters */}

<Route path="masters" element={<MastersDashboard />} />
<Route path="masters/countries" element={<CountryMaster />} />
<Route path="masters/states" element={<StateMaster />} />
<Route path="masters/districts" element={<DistrictMaster />} />
<Route path="masters/cities" element={<CityMaster />} />
<Route path="masters/currencies" element={<CurrencyMaster />} />
<Route path="masters/customer-types" element={<CustomerTypeMaster />} />
<Route path="masters/industry-segments" element={<IndustrySegmentMaster />} />
<Route path="masters/msme-status" element={<MSMEStatusMaster />} />
<Route path="masters/customer-status" element={<CustomerStatusMaster />} />
<Route path="masters/departments" element={<DepartmentMaster />}/>
<Route path="masters/designations" element={<DesignationMaster />}/>
<Route path="masters/units" element={<UnitMaster />}/>
<Route path="masters/material-categories" element={<MaterialCategoryMaster />}/>
<Route path="masters/work-types" element={<WorkTypeMaster />}/>
<Route path="masters/expense-types" element={<ExpenseTypeMaster />}/>
<Route path="masters/payment-terms" element={<PaymentTermsMaster />}/>
<Route path="masters/taxes" element={<TaxMaster />}/>
<Route path="masters/project-stages" element={<ProjectStageMaster />}/>
<Route path="masters/approval-levels" element={<ApprovalLevelMaster />}/>
<Route path="masters/project-sites" element={<ProjectSiteMaster />}/>
<Route path="masters/boq-items" element={<BOQItemMaster />}/>

<Route path="masters/customers" element={<CustomerMaster />}/>
<Route path="masters/suppliers" element={<SupplierMaster />}/>
<Route path="masters/vendors-master" element={<VendorMaster />}/>
<Route path="masters/employees-master" element={<EmployeeMasterPage />}/>
<Route path="masters/projects-master" element={<ProjectMasterPage />}/>
<Route path="masters/roles-master" element={<RolesMasterPage />}/>

        {/* Sales */}
        <Route path="sales/clients" element={<ClientMaster />} />
        <Route path="sales/leads" element={<LeadManagement />} />
        <Route path="sales/quotations" element={<QuotationBuilder />} />
        <Route path="sales/po" element={<PORegister />} />
        <Route path="sales/revenue" element={<RevenueTracking />} />

        {/* Projects */}
        <Route path="projects" element={<ProjectSetup />} />
        <Route path="projects/stages" element={<StageTracker />} />
        <Route path="projects/tasks" element={<TaskBoard />} />
        <Route path="projects/dpr" element={<DPR />} />
        <Route path="projects/milestones" element={<Milestones />} />

        {/* Inventory */}
        <Route path="inventory/items" element={<ItemCatalogue />} />
        <Route path="inventory/grn" element={<GRN />} />
        <Route path="inventory/warehouse" element={<WarehouseStock />} />
        <Route path="inventory/dispatch" element={<SiteDispatch />} />
        <Route path="inventory/consumption" element={<ConsumptionLog />} />
        <Route path="inventory/returns" element={<ReturnsTracker />} />
        <Route path="inventory/contracts" element={<AnnualContracts />} />

        {/* Vendors */}
        <Route path="vendors" element={<VendorRegister />} />
        <Route path="vendors/onboarding" element={<VendorOnboarding />} />
        <Route path="vendors/workorders" element={<WorkOrders />} />
        <Route path="vendors/payments" element={<MilestonePayments />} />

        {/* HR */}
        <Route path="hr/employees" element={<EmployeeMaster />} />
        <Route path="hr/attendance" element={<AttendanceLeave />} />
        <Route path="hr/payroll" element={<Payroll />} />
        <Route path="hr/recruitment" element={<Recruitment />} />
        <Route path="hr/performance" element={<Performance />} />
        <Route path="hr/training" element={<Training />} />

        {/* Finance */}
        <Route path="finance/budget" element={<BudgetPlanning />} />
        <Route path="finance/pl" element={<ProjectPL />} />
        <Route path="finance/costs" element={<CostManagement />} />
        <Route path="finance/cashflow" element={<CashFlow />} />
        <Route path="finance/alerts" element={<CostOverrunAlerts />} />

        {/* Accounts */}
        <Route path="accounts/invoices" element={<InvoiceManagement />} />
        <Route path="accounts/payments" element={<PaymentReceipts />} />
        <Route path="accounts/ledger" element={<LedgerManagement />} />
        <Route path="accounts/approvals" element={<PaymentApprovals />} />

        {/* Admin */}
        <Route path="admin/users" element={
          <ProtectedRoute allowedRoles={['super_admin' ,'admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/roles" element={<RoleManagement/>} />
        <Route path="admin/audit" element={<AuditTrail />} />
        <Route path="admin/settings" element={<div className="card p-8 text-center text-gray-500">Settings page coming soon</div>} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;