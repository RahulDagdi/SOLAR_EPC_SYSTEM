// const mongoose = require("mongoose");

// const customerStatusSchema = new mongoose.Schema(
//   {
//     statusName: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     color: {
//       type: String,
//       default: "#22c55e",
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

// module.exports = mongoose.model("CustomerStatus", customerStatusSchema);


const mongoose = require("mongoose");

const customerStatusSchema = new mongoose.Schema({

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
    "CustomerStatus",
    customerStatusSchema
);