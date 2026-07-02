const express = require("express");

const router = express.Router();

const {

    getApprovalLevels,
    getApprovalLevel,
    createApprovalLevel,
    updateApprovalLevel,
    deleteApprovalLevel

} = require("../../controllers/masters/approvalLevel.controller");

router.get("/", getApprovalLevels);

router.get("/:id", getApprovalLevel);

router.post("/", createApprovalLevel);

router.put("/:id", updateApprovalLevel);

router.delete("/:id", deleteApprovalLevel);

module.exports = router;
