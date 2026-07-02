const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema(

    {

        country:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Country",
            required:true
        },

        name:{
            type:String,
            required:true,
            trim:true
        },

        stateCode:{
            type:String,
            uppercase:true,
            trim:true
        },

        gstCode:{
            type:String,
            trim:true
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

module.exports=mongoose.model("State",stateSchema);