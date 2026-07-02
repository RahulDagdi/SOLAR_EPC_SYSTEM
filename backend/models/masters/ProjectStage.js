const mongoose = require("mongoose");

const projectStageSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    code: {
        type: String,
        trim: true,
        uppercase: true
    },

    sequence: {
        type: Number,
        default: 0
    },

    description: {
        type: String,
        trim: true
    },

    status: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "ProjectStage",
    projectStageSchema
);
