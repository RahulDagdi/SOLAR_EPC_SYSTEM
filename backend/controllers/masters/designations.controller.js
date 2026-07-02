const Designation = require("../../models/masters/Designation");

const base = require("./baseMaster.controller");

exports.getDesignations = base.getAll(Designation);

exports.getDesignation = base.getById(Designation);

exports.createDesignation = base.create(Designation);

exports.updateDesignation = base.update(Designation);

exports.deleteDesignation = base.remove(Designation);
