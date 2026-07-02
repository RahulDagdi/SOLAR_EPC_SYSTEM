const express = require("express");

const router = express.Router();

const {

    getCustomerStatuses,
    getCustomerStatus,
    createCustomerStatus,
    updateCustomerStatus,
    deleteCustomerStatus

} = require("../../controllers/masters-old/customerStatus.controller");

router.get("/", getCustomerStatuses);

router.get("/:id", getCustomerStatus);

router.post("/", createCustomerStatus);

router.put("/:id", updateCustomerStatus);

router.delete("/:id", deleteCustomerStatus);

module.exports = router;