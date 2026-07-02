const express = require("express");

const router = express.Router();

const {

    getProjectStages,
    getProjectStage,
    createProjectStage,
    updateProjectStage,
    deleteProjectStage

} = require("../../controllers/masters/projectStage.controller");

router.get("/", getProjectStages);

router.get("/:id", getProjectStage);

router.post("/", createProjectStage);

router.put("/:id", updateProjectStage);

router.delete("/:id", deleteProjectStage);

module.exports = router;
