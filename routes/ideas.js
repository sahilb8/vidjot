const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//this to bring in the ensureauthenticated function from the auth.js in helpers, you can bring multiple functions by adding then in the curly braces seperated by a comma
const {ensureAuthenticated} = require("../helpers/auth");


//Load Idea model
//  ../ here because we have to go outside this folder for models
require('../models/Idea');
const Idea = mongoose.model("ideas");


//IDEA index route
router.get("/", ensureAuthenticated, (req,res)=>{
    Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render("ideas/index",{
            ideas:ideas
        });
    });
});

//add Idea Form route
router.get("/add", ensureAuthenticated, (req,res)=>{
    res.render("ideas/add");
});

//edit Idea Form route, over here in url :id represents the idea id which we want to edit,we can access it using req.params.id
router.get("/edit/:id", ensureAuthenticated, (req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        if(idea.user != req.user.id){
            req.flash("error_msg","Not Authorized");
            res.redirect("/ideas");
        }else{
            res.render("ideas/edit",{
                idea:idea
       });
    }
    });
   
});

//handle idea post request
router.post("/", ensureAuthenticated, (req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text:"Please add a title"});
    }
    if(!req.body.details){
        errors.push({text:"Please add details"});
    }

    if(errors.length > 0){
        res.render("ideas/add",{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{
        //This code is when you have no errors
        const NewUser = {
            title : req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(NewUser)
            .save()
            //this is the promise that will return once its saved on the database.
            .then(idea =>{
                req.flash("success_msg","App Idea Inserted");
                res.redirect("/ideas");
            })
    }
});

//handle idea edit put request
router.put('/:id', ensureAuthenticated, (req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        idea.title= req.body.title;
        idea.details= req.body.details;
        idea.save()
        .then(idea=>{
            req.flash("success_msg","App Idea Updated");
            res.redirect("/ideas");
    });
   
        });
});

//delete an idea,  as long as the methods are different you can same url.
router.delete("/:id", ensureAuthenticated, (req,res)=>{
    Idea.remove({_id:req.params.id})
    .then(()=>{
        req.flash("success_msg", "App Idea Removed");
        res.redirect("/ideas");
    });
});


module.exports = router;