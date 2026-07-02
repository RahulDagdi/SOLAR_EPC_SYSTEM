const express = require("express");

const router = express.Router();

const {

    getMSMEStatuses,
    getMSMEStatus,
    createMSMEStatus,
    updateMSMEStatus,
    deleteMSMEStatus

} = require("../../controllers/masters/msmeStatus.controller");

router.get("/", getMSMEStatuses);

router.get("/:id", getMSMEStatus);

router.post("/", createMSMEStatus);

router.put("/:id", updateMSMEStatus);

router.delete("/:id", deleteMSMEStatus);

module.exports = router;