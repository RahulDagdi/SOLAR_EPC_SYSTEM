const express = require("express");

const router = express.Router();

const {

    getCurrencies,
    getCurrency,
    createCurrency,
    updateCurrency,
    deleteCurrency

} = require("../../controllers/masters-old/currency.controller");

router.get("/", getCurrencies);

router.get("/:id", getCurrency);

router.post("/", createCurrency);

router.put("/:id", updateCurrency);

router.delete("/:id", deleteCurrency);

module.exports = router;