const express = require("express");

const router = express.Router();

const {

    getCountries,
    getCountry,
    createCountry,
    updateCountry,
    deleteCountry

} = require("../../controllers/masters/country.controller");

router.get("/", getCountries);

router.get("/:id", getCountry);

router.post("/", createCountry);

router.put("/:id", updateCountry);

router.delete("/:id", deleteCountry);

module.exports = router;