const Tax = require("../../models/masters/Tax");

const base = require("./baseMaster.controller");

exports.getTaxes = base.getAll(Tax);

exports.getTax = base.getById(Tax);

exports.createTax = base.create(Tax);

exports.updateTax = base.update(Tax);

exports.deleteTax = base.remove(Tax);
