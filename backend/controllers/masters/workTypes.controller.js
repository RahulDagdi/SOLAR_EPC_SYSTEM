const WorkType = require("../../models/masters/WorkType");

const base = require("./baseMaster.controller");

exports.getWorkTypes = base.getAll(WorkType);

exports.getWorkType = base.getById(WorkType);

exports.createWorkType = base.create(WorkType);

exports.updateWorkType = base.update(WorkType);

exports.deleteWorkType = base.remove(WorkType);
