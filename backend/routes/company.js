const express = require('express');
const router = express.Router();

const Company = require('../models/Company');
const { auth, authorize } = require('../middleware/auth');

router.get(
 '/',
 auth,
 authorize('super_admin'),

 async (req,res)=>{

   const companies = await Company.find({
      isDeleted:false
   });

   res.json({
      success:true,
      data:companies
   });

 });

module.exports = router;