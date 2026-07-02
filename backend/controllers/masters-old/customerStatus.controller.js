const CustomerStatus = require("../../models/masters-old/CustomerStatus");

const base = require("./baseMaster.controller");

exports.getCustomerStatuses = base.getAll(CustomerStatus);

exports.getCustomerStatus = base.getById(CustomerStatus);

exports.createCustomerStatus = base.create(CustomerStatus);

exports.updateCustomerStatus = base.update(CustomerStatus);

exports.deleteCustomerStatus = base.remove(CustomerStatus);