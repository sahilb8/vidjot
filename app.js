const express = require("express");
const exphbs  = require('express-handlebars');
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

//BODY-PARSER middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//INDEX ROUTE
app.get("/",(req,res)=>{
    //you can pass this variable title to the insex.handlebars and use it there
    const title="Welcome";
    res.render("index",{
        title: title
    });
    // console.log(req.name);
});

//add Idea Form route
app.get("/ideas/add",(req,res)=>{
    res.render("ideas/add");
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
                res.redirect("/ideas");
            })
    }
});
//ABOUT ROUTE
app.get("/about",(req,res)=>{
    res.render("about");
});
const port = 5000;
//the ()=> indicates callback function, same as function()
app.listen(port,()=> {
    console.log(`The server started on port ${port}`);
    // same as doing console.log("The serevr started on port "+ port);
    // but just the ES6 way of doing it
});
