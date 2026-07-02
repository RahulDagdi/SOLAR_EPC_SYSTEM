// const mongoose = require("mongoose");

// const industrySegmentSchema = new mongoose.Schema(
//   {
//     segmentName: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("IndustrySegment", industrySegmentSchema);


const mongoose = require("mongoose");

const industrySegmentSchema = new mongoose.Schema({

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
    "IndustrySegment",
    industrySegmentSchema
);