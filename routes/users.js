const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//USER LOGIN ROUTE
router.get("/login",(req,res)=>{
    res.render("users/login");
});

//USER REGISTER ROUTE
router.get("/register",(req,res)=>{
    res.render("users/register");
});


module.exports = router;