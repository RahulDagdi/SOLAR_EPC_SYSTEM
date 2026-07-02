const Country = require("../../models/masters-old/Country");

const base = require("./baseMaster.controller");

exports.getCountries = base.getAll(Country);

exports.getCountry = base.getById(Country);

exports.createCountry = base.create(Country);

exports.updateCountry = base.update(Country);

exports.deleteCountry = base.remove(Country);