const Currency = require("../../models/masters-old/Currency");

const base = require("./baseMaster.controller");

exports.getCurrencies = base.getAll(Currency);

exports.getCurrency = base.getById(Currency);

exports.createCurrency = base.create(Currency);

exports.updateCurrency = base.update(Currency);

exports.deleteCurrency = base.remove(Currency);