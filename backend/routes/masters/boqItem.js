const express = require("express");

const router = express.Router();

const {

    getBOQItems,
    getBOQItem,
    createBOQItem,
    updateBOQItem,
    deleteBOQItem

} = require("../../controllers/masters/boqItem.controller");

router.get("/", getBOQItems);

router.get("/:id", getBOQItem);

router.post("/", createBOQItem);

router.put("/:id", updateBOQItem);

router.delete("/:id", deleteBOQItem);

module.exports = router;
