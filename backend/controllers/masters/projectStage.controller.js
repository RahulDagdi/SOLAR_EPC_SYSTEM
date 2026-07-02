const ProjectStage = require("../../models/masters/ProjectStage");

const base = require("./baseMaster.controller");

exports.getProjectStages = base.getAll(ProjectStage);

exports.getProjectStage = base.getById(ProjectStage);

exports.createProjectStage = base.create(ProjectStage);

exports.updateProjectStage = base.update(ProjectStage);

exports.deleteProjectStage = base.remove(ProjectStage);
