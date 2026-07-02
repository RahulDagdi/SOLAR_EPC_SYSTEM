const express = require("express");

const router = express.Router();

const {

    getWorkTypes,
    getWorkType,
    createWorkType,
    updateWorkType,
    deleteWorkType

} = require("../../controllers/masters/workTypes.controller");

router.get("/", getWorkTypes);

router.get("/:id", getWorkType);

router.post("/", createWorkType);

router.put("/:id", updateWorkType);

router.delete("/:id", deleteWorkType);

module.exports = router;
