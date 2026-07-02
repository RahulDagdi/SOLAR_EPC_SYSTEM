# Solar EPC Management System

## Complete Web-based ERP System for Solar EPC Company

### System Architecture

- **Frontend**: React.js + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Local & Atlas Cloud)
- **Authentication**: JWT + Role-Based Access Control

### 7 Modules

1. **Human Resources** - Employee Master, Attendance, Payroll, Recruitment, Performance, Training
2. **Finance** - Budget Planning, P&L, Cost Management, Cash Flow, Overrun Alerts
3. **Accounts** - GST Invoices, Payments, Ledger, Approvals, Audit Trail
4. **Project Management** - 8-Stage Tracker, Tasks, DPR, Milestones, Change Orders
5. **Inventory** - Item Catalogue, GRN, Warehouse, Dispatch, Consumption, Returns
6. **Vendor Management** - Register, Onboarding, Work Orders, Milestone Payments
7. **Sales** - Lead Management, Quotation Builder, PO Register, Revenue Tracking

### Auth System

- **Login**: All users (including Super Admin)
- **Register**: Only Super Admin can create users with roles
- **Forgot Password**: Only Super Admin can reset passwords
- **Organization-based**: Super Admin creates organizations, users belong to one org

### Features

- Full CRUD operations (Get, Add, Update, Delete)
- Single row delete + Bulk delete + Soft delete with restore
- Pagination, Search, Filter
- GST-compliant invoice generation
- Role-based access control (8 roles)
- Dashboard with charts (Revenue, Projects, Leads, Invoices)
- Audit trail for all operations
- Indian date format (DD/MM/YYYY) and number format (1,00,000)

### Setup Instructions

#### Backend Setup

```bash
cd backend
npm install
# Create .env file with your MongoDB URI
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

#### MongoDB Setup

- **Local**: Install MongoDB locally, connection string: `mongodb://localhost:27017/atpl_solar_epc`
- **Atlas**: Create cluster on MongoDB Atlas, update MONGODB_URI_ATLAS in .env

### Default Ports

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### API Endpoints

- `/api/auth` - Authentication (login, register, forgot password)
- `/api/users` - User management
- `/api/clients` - Client master
- `/api/projects` - Project management
- `/api/tasks` - Task board
- `/api/milestones` - Milestones
- `/api/dpr` - Daily progress reports
- `/api/invoices` - GST invoices
- `/api/payments` - Payment receipts
- `/api/ledger` - Ledger management
- `/api/inventory` - Inventory (items, GRN, warehouse, dispatch, consumption, returns, contracts)
- `/api/vendors` - Vendor management
- `/api/workorders` - Work orders
- `/api/hr` - HR (employees, attendance, leave, payroll, recruitment, performance, training)
- `/api/sales` - Sales (leads, quotations, PO, revenue)
- `/api/finance` - Finance (budget, costs, P&L, cash flow, overrun alerts)
- `/api/reports` - Dashboard reports & analytics
- `/api/audit` - Audit trail

### User Roles

- `super_admin` - Full access, can create users and organizations
- `admin` - Organization admin
- `finance_manager` - Finance and accounts access
- `project_manager` - Project and inventory access
- `hr_manager` - HR module only
- `site_supervisor` - Mobile app, DPR, tasks
- `sales_executive` - Sales module only
- `accountant` - Accounts module
- `vendor` - External portal

### Development Phases

1. Foundation (Auth, Users, Projects, Clients)
2. Core Operations (Tasks, DPR, Invoices, Payments)
3. Inventory (Items, GRN, Warehouse, Dispatch)
4. Finance & HR (Budget, Payroll, Attendance)
5. Vendor & Sales (Vendors, Leads, Quotations)
6. Reports, Notifications, Polish
7. Testing & Go-Live

### Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt (12 rounds)
- Role-based access control on every route
- Input validation with express-validator
- Rate limiting
- Helmet security headers
- Audit logging for all operations
- Soft delete (never lose data)
- Invoice numbers cannot be modified (GST compliance)

### Contact

For queries, contact the project lead before making assumptions.
