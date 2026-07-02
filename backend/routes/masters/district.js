const express = require("express");

const router = express.Router();

const {

    getDistricts,
    getDistrict,
    createDistrict,
    updateDistrict,
    deleteDistrict

} = require("../../controllers/masters/district.controller");

router.get("/", getDistricts);

router.get("/:id", getDistrict);

router.post("/", createDistrict);

router.put("/:id", updateDistrict);

router.delete("/:id", deleteDistrict);

module.exports = router;