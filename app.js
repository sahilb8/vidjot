const express = require("express");
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();
//map global promise - get rid of warning
mongoose.Promise=global.Promise;
//connect with MongoDB
mongoose.connect("mongodb://localhost/vidjotdb",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log("MongoDB connected"))
.catch(err=> console.log(err));

//Load Idea model
require('./models/Idea');
const Idea = mongoose.model("ideas");


//how middleware works
// app.use(function(req,res,next){
//     console.log(Date.now());
//     req.name="Sahil";
//     next();
// });


//HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//METHOD-OVERRIDE MIDDLEWARE
app.use(methodOverride('_method'))

//BODY-PARSER middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//EXPRESS-SESSION MIDDLEWARE
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//CONNECT-FLASH MIDDLEWARE
app.use(flash());

//GLOBAL VARIABLE
app.use(function(req,res,next){
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

//INDEX ROUTE
app.get("/",(req,res)=>{
    //you can pass this variable title to the insex.handlebars and use it there
    const title="Welcome";
    res.render("index",{
        title: title
    });
    // console.log(req.name);
});

//ABOUT ROUTE
app.get("/about",(req,res)=>{
    res.render("about");
});

//IDEA index route
app.get("/ideas",(req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render("ideas/index",{
            ideas:ideas
        });
    });
});

//add Idea Form route
app.get("/ideas/add",(req,res)=>{
    res.render("ideas/add");
});

//edit Idea Form route, over here in url :id represents the idea id which we want to edit,we can access it using req.params.id
app.get("/ideas/edit/:id",(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        res.render("ideas/edit",{
            idea:idea
        });
    });
   
});

//handle idea post request
app.post("/ideas",(req,res)=>{
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
            details: req.body.details
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
app.put('/ideas/:id',(req,res)=>{
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
app.delete("/ideas/:id",(req,res)=>{
    Idea.remove({_id:req.params.id})
    .then(()=>{
        req.flash("success_msg", "App Idea Removed");
        res.redirect("/ideas");
    });
});

const port = 5000;
//the ()=> indicates callback function, same as function()
app.listen(port,()=> {
    console.log(`The server started on port ${port}`);
    // same as doing console.log("The serevr started on port "+ port);
    // but just the ES6 way of doing it
});
