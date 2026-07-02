const ProjectSite = require("../../models/masters/ProjectSite");

const base = require("./baseMaster.controller");

exports.getProjectSites = base.getAll(ProjectSite);

exports.getProjectSite = base.getById(ProjectSite);

exports.createProjectSite = base.create(ProjectSite);

exports.updateProjectSite = base.update(ProjectSite);

exports.deleteProjectSite = base.remove(ProjectSite);
