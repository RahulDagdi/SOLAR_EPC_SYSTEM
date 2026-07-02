// const City = require("../../models/masters/City");

// const base = require("./baseMaster.controller");

// exports.getCities = base.getAll(City);

// exports.getCity = base.getById(City);

// exports.createCity = base.create(City);

// exports.updateCity = base.update(City);

// exports.deleteCity = base.remove(City);

const City = require("../../models/masters-old/City");
const base = require("./baseMaster.controller");

exports.getCities = base.getAll(City, "country state");

exports.getCity = base.getById(City, "country state");

exports.createCity = base.create(City);

exports.updateCity = base.update(City);

exports.deleteCity = base.remove(City);