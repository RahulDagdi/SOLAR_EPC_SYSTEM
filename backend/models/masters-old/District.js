const mongoose=require("mongoose");

const districtSchema=new mongoose.Schema(

{

    state:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"State",
        required:true
    },

    name:{
        type:String,
        required:true,
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

module.exports=mongoose.model("District",districtSchema);