const express = require("express");

const router = express.Router();

const {

    getCustomerTypes,
    getCustomerType,
    createCustomerType,
    updateCustomerType,
    deleteCustomerType

} = require("../../controllers/masters-old/customerType.controller");

router.get("/", getCustomerTypes);

router.get("/:id", getCustomerType);

router.post("/", createCustomerType);

router.put("/:id", updateCustomerType);

router.delete("/:id", deleteCustomerType);

module.exports = router;