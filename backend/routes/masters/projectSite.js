const express = require("express");

const router = express.Router();

const {

    getProjectSites,
    getProjectSite,
    createProjectSite,
    updateProjectSite,
    deleteProjectSite

} = require("../../controllers/masters/projectSite.controller");

router.get("/", getProjectSites);

router.get("/:id", getProjectSite);

router.post("/", createProjectSite);

router.put("/:id", updateProjectSite);

router.delete("/:id", deleteProjectSite);

module.exports = router;
