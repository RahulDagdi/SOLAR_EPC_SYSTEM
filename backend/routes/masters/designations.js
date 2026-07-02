const express = require("express");

const router = express.Router();

const {

    getDesignations,
    getDesignation,
    createDesignation,
    updateDesignation,
    deleteDesignation

} = require("../../controllers/masters/designations.controller");

router.get("/", getDesignations);

router.get("/:id", getDesignation);

router.post("/", createDesignation);

router.put("/:id", updateDesignation);

router.delete("/:id", deleteDesignation);

module.exports = router;
