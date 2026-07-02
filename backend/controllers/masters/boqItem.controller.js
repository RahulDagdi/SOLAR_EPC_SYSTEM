const BOQItem = require("../../models/masters/BOQItem");

const base = require("./baseMaster.controller");

exports.getBOQItems = base.getAll(BOQItem);

exports.getBOQItem = base.getById(BOQItem);

exports.createBOQItem = base.create(BOQItem);

exports.updateBOQItem = base.update(BOQItem);

exports.deleteBOQItem = base.remove(BOQItem);
