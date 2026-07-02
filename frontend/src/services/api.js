import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://solar-epc-system.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const companyService = {
  getAll: () => api.get('/company')
};

// Generic CRUD operations
export const createCrudService = (endpoint) => ({
  getAll: (params = {}) => api.get(`/${endpoint}`, { params }),
  getById: (id) => api.get(`/${endpoint}/${id}`),
  create: (data) => api.post(`/${endpoint}`, data),
  update: (id, data) => api.put(`/${endpoint}/${id}`, data),
  delete: (id) => api.delete(`/${endpoint}/${id}`),
  bulkDelete: (ids) => api.post(`/${endpoint}/bulk/delete`, { ids }),
  getDeleted: () => api.get(`/${endpoint}/deleted/list`),
  restore: (id) => api.post(`/${endpoint}/${id}/restore`),
});

// Auth Service
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  getMe: () => api.get('/auth/me'),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
};

// Dashboard Service
export const dashboardService = {
  getStats: () => api.get('/reports/dashboard'),
  getProjectStages: () => api.get('/reports/project-stages'),
  getMonthlyRevenue: (year) => api.get('/reports/monthly-revenue', { params: { year } }),
  getLeadFunnel: () => api.get('/reports/lead-funnel'),
};

// Project Service
export const projectService = createCrudService('projects');

// Client Service
export const clientService = createCrudService('clients');

// Task Service
export const taskService = createCrudService('tasks');

// Milestone Service
export const milestoneService = createCrudService('milestones');

// DPR Service
export const dprService = createCrudService('dpr');

// Invoice Service
export const invoiceService = createCrudService('invoices');

// Payment Service
export const paymentService = createCrudService('payments');

// Inventory Service
export const inventoryService = {
  ...createCrudService('inventory'),
  getItems: (params) => api.get('/inventory/items', { params }),
  createItem: (data) => api.post('/inventory/items', data),
  updateItem: (id, data) => api.put(`/inventory/items/${id}`, data),
  deleteItem: (id) => api.delete(`/inventory/items/${id}`),
  getGRN: (params) => api.get('/inventory/grn', { params }),
  createGRN: (data) => api.post('/inventory/grn', data),
  getWarehouse: (params) => api.get('/inventory/warehouse', { params }),
  getDispatch: (params) => api.get('/inventory/dispatch', { params }),
  createDispatch: (data) => api.post('/inventory/dispatch', data),
  getConsumption: (params) => api.get('/inventory/consumption', { params }),
  createConsumption: (data) => api.post('/inventory/consumption', data),
  getReturns: (params) => api.get('/inventory/returns', { params }),
  createReturn: (data) => api.post('/inventory/returns', data),
  getContracts: (params) => api.get('/inventory/contracts', { params }),
  createContract: (data) => api.post('/inventory/contracts', data),
};

// Vendor Service
export const vendorService = createCrudService('vendors');

// Work Order Service
export const workOrderService = createCrudService('workorders');

// HR Service
export const hrService = {
  getEmployees: (params) => api.get('/hr/employees', { params }),
  createEmployee: (data) => api.post('/hr/employees', data),
  updateEmployee: (id, data) => api.put(`/hr/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/hr/employees/${id}`),
  getAttendance: (params) => api.get('/hr/attendance', { params }),
  createAttendance: (data) => api.post('/hr/attendance', data),
  getLeaves: (params) => api.get('/hr/leaves', { params }),
  createLeave: (data) => api.post('/hr/leaves', data),
  approveLeave: (id) => api.put(`/hr/leaves/${id}/approve`),
  rejectLeave: (id, reason) => api.put(`/hr/leaves/${id}/reject`, { rejectionReason: reason }),
  getPayroll: (params) => api.get('/hr/payroll', { params }),
  createPayroll: (data) => api.post('/hr/payroll', data),
  getRecruitment: (params) => api.get('/hr/recruitment', { params }),
  createRecruitment: (data) => api.post('/hr/recruitment', data),
  getPerformance: (params) => api.get('/hr/performance', { params }),
  createPerformance: (data) => api.post('/hr/performance', data),
  getTraining: (params) => api.get('/hr/training', { params }),
  createTraining: (data) => api.post('/hr/training', data),
};

// Sales Service
export const salesService = {
  getLeads: (params) => api.get('/sales/leads', { params }),
  createLead: (data) => api.post('/sales/leads', data),
  updateLead: (id, data) => api.put(`/sales/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/sales/leads/${id}`),
  getQuotations: (params) => api.get('/sales/quotations', { params }),
  createQuotation: (data) => api.post('/sales/quotations', data),
  updateQuotation: (id, data) => api.put(`/sales/quotations/${id}`, data),
  deleteQuotation: (id) => api.delete(`/sales/quotations/${id}`),
  getPOs: (params) => api.get('/sales/po', { params }),
  createPO: (data) => api.post('/sales/po', data),
  updatePO: (id, data) => api.put(`/sales/po/${id}`, data),
  deletePO: (id) => api.delete(`/sales/po/${id}`),
  getRevenue: (year) => api.get('/sales/revenue', { params: { year } }),
};

// Finance Service
export const financeService = {
  getBudgets: (params) => api.get('/finance/budget', { params }),
  createBudget: (data) => api.post('/finance/budget', data),
  updateBudget: (id, data) => api.put(`/finance/budget/${id}`, data),
  deleteBudget: (id) => api.delete(`/finance/budget/${id}`),
  getCosts: (params) => api.get('/finance/costs', { params }),
  createCost: (data) => api.post('/finance/costs', data),
  updateCost: (id, data) => api.put(`/finance/costs/${id}`, data),
  deleteCost: (id) => api.delete(`/finance/costs/${id}`),
  getProjectPL: (projectId) => api.get(`/finance/project-pl/${projectId}`),
  getCashFlow: () => api.get('/finance/cash-flow'),
  getOverrunAlerts: () => api.get('/finance/overrun-alerts'),
};

// Audit Service
export const auditService = {
  getLogs: (params) => api.get('/audit', { params }),
};

// User Management Service
export const userService = createCrudService('users');


// Role Management Service
export const roleService=createCrudService("roles");



export default api;
