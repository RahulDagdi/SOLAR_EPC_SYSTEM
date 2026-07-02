const express = require("express");

const router = express.Router();

const {

    getStates,
    getState,
    createState,
    updateState,
    deleteState

} = require("../../controllers/masters/state.controller");

router.get("/", getStates);

router.get("/:id", getState);

router.post("/", createState);

router.put("/:id", updateState);

router.delete("/:id", deleteState);

module.exports = router;