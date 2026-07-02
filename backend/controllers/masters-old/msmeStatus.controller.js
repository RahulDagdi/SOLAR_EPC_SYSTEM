const MSMEStatus = require("../../models/masters-old/MSMEStatus");

const base = require("./baseMaster.controller");

exports.getMSMEStatuses = base.getAll(MSMEStatus);

exports.getMSMEStatus = base.getById(MSMEStatus);

exports.createMSMEStatus = base.create(MSMEStatus);

exports.updateMSMEStatus = base.update(MSMEStatus);

exports.deleteMSMEStatus = base.remove(MSMEStatus);