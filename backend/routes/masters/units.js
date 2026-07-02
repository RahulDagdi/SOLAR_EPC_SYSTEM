const express = require("express");

const router = express.Router();

const {

    getUnits,
    getUnit,
    createUnit,
    updateUnit,
    deleteUnit

} = require("../../controllers/masters/units.controller");

router.get("/", getUnits);

router.get("/:id", getUnit);

router.post("/", createUnit);

router.put("/:id", updateUnit);

router.delete("/:id", deleteUnit);

module.exports = router;
