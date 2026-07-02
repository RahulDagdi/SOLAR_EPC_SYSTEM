const express = require("express");

const router = express.Router();

const {

    getIndustrySegments,
    getIndustrySegment,
    createIndustrySegment,
    updateIndustrySegment,
    deleteIndustrySegment

} = require("../../controllers/masters/industrySegment.controller");

router.get("/", getIndustrySegments);

router.get("/:id", getIndustrySegment);

router.post("/", createIndustrySegment);

router.put("/:id", updateIndustrySegment);

router.delete("/:id", deleteIndustrySegment);

module.exports = router;