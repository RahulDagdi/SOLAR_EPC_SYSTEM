const Unit = require("../../models/masters/Unit");

const base = require("./baseMaster.controller");

exports.getUnits = base.getAll(Unit);

exports.getUnit = base.getById(Unit);

exports.createUnit = base.create(Unit);

exports.updateUnit = base.update(Unit);

exports.deleteUnit = base.remove(Unit);
