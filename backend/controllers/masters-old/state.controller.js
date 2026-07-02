// const State = require("../../models/masters/State");
// const base = require("./baseMaster.controller");

// exports.getStates = base.getAll(State, "country");

// exports.getState = base.getById(State, "country");

// exports.createState = base.create(State);

// exports.updateState = base.update(State);

// exports.deleteState = base.remove(State);

const State = require("../../models/masters-old/State");
const base = require("./baseMaster.controller");

exports.getStates = base.getAll(State, "country");

exports.getState = base.getById(State, "country");

exports.createState = base.create(State);

exports.updateState = base.update(State);

exports.deleteState = base.remove(State);