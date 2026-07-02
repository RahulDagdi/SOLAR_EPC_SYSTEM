const mongoose = require("mongoose");

const materialCategorySchema = new mongoose.Schema({

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
    "MaterialCategory",
    materialCategorySchema
);
