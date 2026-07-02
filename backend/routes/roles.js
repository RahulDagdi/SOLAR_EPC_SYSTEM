const express=require("express");
const router=express.Router();

const Role=require("../models/Role");

const {auth,authorize}=require("../middleware/auth");



router.get(
"/",

auth,

authorize(
"super_admin",
"admin"
),

async(req,res)=>{

try{

let query={};

if(req.user.role==="admin"){

query.organizationId=req.user.organizationId;

}

const roles=await Role.find(query);

res.json({

success:true,

data:roles

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

}

);



router.post(

"/",

auth,

authorize("admin"),

async(req,res)=>{

try{

const role=await Role.create({

name:req.body.name,

permissions:req.body.permissions,

organizationId:req.user.organizationId,

createdBy:req.user._id

});

res.status(201).json({

success:true,

data:role

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

});

router.put(
"/:id",
auth,
authorize("admin"),
async(req,res)=>{
try{
const role=await Role.findByIdAndUpdate(
req.params.id,
{
name:req.body.name,
permissions:req.body.permissions
},
{ new:true }
);
if(!role){
return res.status(404).json({
success:false,
message:"Role not found"
});
}
res.json({
success:true,
data:role
});
}catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
}
);

router.delete(
"/:id",
auth,
authorize("admin"),
async(req,res)=>{
try{
const role=await Role.findByIdAndDelete(req.params.id);
if(!role){
return res.status(404).json({
success:false,
message:"Role not found"
});
}
res.json({
success:true,
message:"Role deleted"
});
}catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
}
);

module.exports=router;