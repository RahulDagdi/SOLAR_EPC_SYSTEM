const MaterialCategory = require("../../models/masters/MaterialCategory");

const base = require("./baseMaster.controller");

exports.getMaterialCategorys = base.getAll(MaterialCategory);

exports.getMaterialCategory = base.getById(MaterialCategory);

exports.createMaterialCategory = base.create(MaterialCategory);

exports.updateMaterialCategory = base.update(MaterialCategory);

exports.deleteMaterialCategory = base.remove(MaterialCategory);
