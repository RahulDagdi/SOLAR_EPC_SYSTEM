const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
    {

        name:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },

        isoCode:{
            type:String,
            required:true,
            uppercase:true,
            trim:true,
            unique:true
        },

        iso3Code:{
            type:String,
            uppercase:true,
            trim:true
        },

        phoneCode:{
            type:String,
            default:"+91"
        },

        currency:{
            type:String,
            default:"INR"
        },

        nationality:{
            type:String,
            default:"Indian"
        },

        flag:{
            type:String,
            default:""
        },

        status:{
            type:Boolean,
            default:true
        }

    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Country",countrySchema);