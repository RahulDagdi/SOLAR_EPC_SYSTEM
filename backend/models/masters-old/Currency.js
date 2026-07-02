// const mongoose = require("mongoose");

// const currencySchema = new mongoose.Schema(
//   {
//     currencyName: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },

//     currencyCode: {
//       type: String,
//       required: true,
//       unique: true,
//       uppercase: true,
//       trim: true,
//     },

//     currencySymbol: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     decimalPlaces: {
//       type: Number,
//       default: 2,
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

// module.exports = mongoose.model("Currency", currencySchema);


const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true
    },

    symbol: String,

    status: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Currency",
    currencySchema
);