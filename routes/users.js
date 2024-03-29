const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//bring in user model
require('../models/User');
const User = mongoose.model('users');

//USER LOGIN ROUTE
router.get("/login",(req,res)=>{
    res.render("users/login");
});

//USER REGISTER ROUTE
router.get("/register",(req,res)=>{
    res.render("users/register");
});

//LOGIN FORM POST
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);//this is to immediately fire off
});

//USER FORM POST
router.post("/register",(req,res)=>{
    let errors = [];
    if(req.body.password != req.body.password2){
        errors.push({text:'Passwords dont match'});
    }
    if(req.body.password.length< 4){
        errors.push({text:'Pasword too short'});
    }
    if(errors.length > 0){
        res.render('users/register',{
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }else{
        User.findOne({email: req.body.email})
        .then(user =>{
            if(user){
                req.flash("error_msg","Email already registered");
                res.redirect("/users/register");
            }else{
                //This code is when you have no errors
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user =>{
                    req.flash("success_msg","You are now registered and can log in");
                    res.redirect('/users/login');
                })
                .catch(err=>{
                    console.log(err);
                    return;
                })
            })
        })
            }
        })
    }
});


//USER LOGOUT ROUTE

router.get("/logout",(req,res)=>{
    req.logOut();
    req.flash("success_msg","You have logged out sucessfully");
    res.redirect("/users/login");
});


module.exports = router;