const mongoose = require("mongoose");

const boqItemSchema = new mongoose.Schema({

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

    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit"
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MaterialCategory"
    },

    rate: {
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
    "BOQItem",
    boqItemSchema
);
