const Department = require("../../models/masters/Department");

const base = require("./baseMaster.controller");

exports.getAll = base.getAll(Department);

exports.getOne = base.getById(Department);

exports.create = base.create(Department);

exports.update = base.update(Department);

exports.remove = base.remove(Department);