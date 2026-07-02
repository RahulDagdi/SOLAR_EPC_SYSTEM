// const mongoose = require("mongoose");

// const departmentSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//     },

//     code: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: Boolean,
//       default: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Department", departmentSchema);

const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    code: String,

    description: String,

    status: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Department",
    departmentSchema
);