const express = require('express');
const router = express.Router();

const Company = require('../models/Company');
const User = require('../models/User');

const { auth, authorize } = require('../middleware/auth');

router.get(
 '/',
 auth,
 authorize('super_admin'),
 async (req, res) => {

   const companies = await Company.find({
      isDeleted:false
   });

   res.json({
      success:true,
      data:companies
   });
});

router.post(
 '/',
 auth,
 authorize('super_admin'),
 async (req,res)=>{

   try{

      const {
         companyName,
         companyCode,
         gstin,
         pan,
         address,
         state,
         city,

         adminName,
         adminEmail,
         password
      } = req.body;

      const company = await Company.create({
         name: companyName,
         code: companyCode,
         gstin,
         pan,
         address,
         state,
         city,
         pincode:'000000'
      });

      const admin = await User.create({
         name: adminName,
         email: adminEmail,
         password,
         role:'admin',
         organizationId: company._id
      });

      res.status(201).json({
         success:true,
         company,
         admin
      });

   }catch(err){

      res.status(500).json({
         success:false,
         message:err.message
      });

   }

});

module.exports = router;