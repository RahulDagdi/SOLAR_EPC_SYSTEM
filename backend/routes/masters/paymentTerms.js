const express = require("express");

const router = express.Router();

const {

    getPaymentTerms,
    getPaymentTerm,
    createPaymentTerm,
    updatePaymentTerm,
    deletePaymentTerm

} = require("../../controllers/masters/paymentTerms.controller");

router.get("/", getPaymentTerms);

router.get("/:id", getPaymentTerm);

router.post("/", createPaymentTerm);

router.put("/:id", updatePaymentTerm);

router.delete("/:id", deletePaymentTerm);

module.exports = router;
