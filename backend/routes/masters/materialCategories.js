const express = require("express");

const router = express.Router();

const {

    getMaterialCategorys,
    getMaterialCategory,
    createMaterialCategory,
    updateMaterialCategory,
    deleteMaterialCategory

} = require("../../controllers/masters/materialCategories.controller");

router.get("/", getMaterialCategorys);

router.get("/:id", getMaterialCategory);

router.post("/", createMaterialCategory);

router.put("/:id", updateMaterialCategory);

router.delete("/:id", deleteMaterialCategory);

module.exports = router;
