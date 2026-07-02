const ApprovalLevel = require("../../models/masters/ApprovalLevel");

const base = require("./baseMaster.controller");

exports.getApprovalLevels = base.getAll(ApprovalLevel);

exports.getApprovalLevel = base.getById(ApprovalLevel);

exports.createApprovalLevel = base.create(ApprovalLevel);

exports.updateApprovalLevel = base.update(ApprovalLevel);

exports.deleteApprovalLevel = base.remove(ApprovalLevel);
