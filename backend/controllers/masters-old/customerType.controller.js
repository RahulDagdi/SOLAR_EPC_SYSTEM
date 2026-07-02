const CustomerType = require("../../models/masters-old/CustomerType");

const base = require("./baseMaster.controller");

exports.getCustomerTypes = base.getAll(CustomerType);

exports.getCustomerType = base.getById(CustomerType);

exports.createCustomerType = base.create(CustomerType);

exports.updateCustomerType = base.update(CustomerType);

exports.deleteCustomerType = base.remove(CustomerType);