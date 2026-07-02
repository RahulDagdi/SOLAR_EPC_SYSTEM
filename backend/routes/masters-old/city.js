const express = require("express");

const router = express.Router();

const {

    getCities,
    getCity,
    createCity,
    updateCity,
    deleteCity

} = require("../../controllers/masters-old/city.controller");

router.get("/", getCities);

router.get("/:id", getCity);

router.post("/", createCity);

router.put("/:id", updateCity);

router.delete("/:id", deleteCity);

module.exports = router;