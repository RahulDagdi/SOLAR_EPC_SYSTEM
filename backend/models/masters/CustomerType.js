// const mongoose = require("mongoose");

// const customerTypeSchema = new mongoose.Schema(
//   {
//     typeName: {
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

// module.exports = mongoose.model("CustomerType", customerTypeSchema);


const mongoose = require("mongoose");

const customerTypeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    code: {
        type: String,
        trim: true
    },

    description: {
        type: String
    },

    status: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "CustomerType",
    customerTypeSchema
);