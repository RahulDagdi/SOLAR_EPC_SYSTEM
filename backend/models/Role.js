const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    organizationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true
    },

    permissions:{
        type:[String],
        default:[]
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true
});

module.exports=mongoose.model("Role",roleSchema);