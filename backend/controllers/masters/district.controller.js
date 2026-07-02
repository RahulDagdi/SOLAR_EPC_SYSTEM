const District = require("../../models/masters/District");

const base = require("./baseMaster.controller");

exports.getDistricts = base.getAll(District);

exports.getDistrict = base.getById(District);

exports.createDistrict = base.create(District);

exports.updateDistrict = base.update(District);

exports.deleteDistrict = base.remove(District);