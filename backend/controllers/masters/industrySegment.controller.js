const IndustrySegment = require("../../models/masters/IndustrySegment");

const base = require("./baseMaster.controller");

exports.getIndustrySegments = base.getAll(IndustrySegment);

exports.getIndustrySegment = base.getById(IndustrySegment);

exports.createIndustrySegment = base.create(IndustrySegment);

exports.updateIndustrySegment = base.update(IndustrySegment);

exports.deleteIndustrySegment = base.remove(IndustrySegment);