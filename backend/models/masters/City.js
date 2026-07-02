// const mongoose=require("mongoose");

// const citySchema=new mongoose.Schema(

// {

//     district:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"District",
//         required:true
//     },

//     name:{
//         type:String,
//         required:true,
//         trim:true
//     },

//     pincode:{
//         type:String,
//         trim:true
//     },

//     status:{
//         type:Boolean,
//         default:true
//     }

// },
// {
//     timestamps:true
// }

// );

// module.exports=mongoose.model("City",citySchema);


const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({

    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
        required: true
    },

    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    cityCode: {
        type: String,
        trim: true,
        uppercase: true
    },

    status: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("City", citySchema);