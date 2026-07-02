const express = require("express");

const router = express.Router();

const {

    getExpenseTypes,
    getExpenseType,
    createExpenseType,
    updateExpenseType,
    deleteExpenseType

} = require("../../controllers/masters/expenseTypes.controller");

router.get("/", getExpenseTypes);

router.get("/:id", getExpenseType);

router.post("/", createExpenseType);

router.put("/:id", updateExpenseType);

router.delete("/:id", deleteExpenseType);

module.exports = router;
