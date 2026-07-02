// MongoDB Setup Script for Solar EPC
// Run this in MongoDB shell or use MongoDB Compass

// Create database
use solar_epc

// Create collections (MongoDB creates them automatically when documents are inserted)
// But we can set up indexes here

// Users collection indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "organizationId": 1 })

// Projects collection indexes
db.projects.createIndex({ "projectName": "text", "poNumber": "text", "siteLocation": "text" })
db.projects.createIndex({ "clientId": 1 })
db.projects.createIndex({ "projectManager": 1 })
db.projects.createIndex({ "organizationId": 1 })

// Clients collection indexes
db.clients.createIndex({ "clientCode": 1 }, { unique: true })
db.clients.createIndex({ "clientName": "text", "clientCode": "text" })
db.clients.createIndex({ "organizationId": 1 })

// Invoices collection indexes
db.invoices.createIndex({ "invoiceNumber": 1 }, { unique: true })
db.invoices.createIndex({ "clientId": 1 })
db.invoices.createIndex({ "projectId": 1 })
db.invoices.createIndex({ "organizationId": 1 })

// Items collection indexes
db.items.createIndex({ "itemCode": 1 }, { unique: true })
db.items.createIndex({ "itemName": "text", "itemCode": "text", "hsnCode": "text" })
db.items.createIndex({ "organizationId": 1 })

// Vendors collection indexes
db.vendors.createIndex({ "vendorCode": 1 }, { unique: true })
db.vendors.createIndex({ "organizationId": 1 })

// Employees collection indexes
db.employees.createIndex({ "employeeId": 1 }, { unique: true })
db.employees.createIndex({ "organizationId": 1 })

// Attendance compound index
db.attendances.createIndex({ "employeeId": 1, "date": 1 }, { unique: true })

// Audit logs indexes
db.auditlogs.createIndex({ "timestamp": -1 })
db.auditlogs.createIndex({ "userId": 1 })
db.auditlogs.createIndex({ "action": 1 })

// Print confirmation
print("MongoDB setup completed for ATPL Solar EPC Management System")
print("Database: atpl_solar_epc")
print("Indexes created successfully")
