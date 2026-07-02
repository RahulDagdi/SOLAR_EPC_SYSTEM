const ExpenseType = require("../../models/masters/ExpenseType");

const base = require("./baseMaster.controller");

exports.getExpenseTypes = base.getAll(ExpenseType);

exports.getExpenseType = base.getById(ExpenseType);

exports.createExpenseType = base.create(ExpenseType);

exports.updateExpenseType = base.update(ExpenseType);

exports.deleteExpenseType = base.remove(ExpenseType);
