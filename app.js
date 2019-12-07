const express = require("express");
const exphbs  = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//LOAD ROUTES
const ideas = require('./routes/ideas');
const users = require('./routes/users');

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

//STATIC FOLDER

app.use(express.static(path.join(__dirname,'public')));

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


//USE ROUTES
//anything that goes to /ideas/anything is gonna pertain to that ideas route
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;
//the ()=> indicates callback function, same as function()
app.listen(port,()=> {
    console.log(`The server started on port ${port}`);
    // same as doing console.log("The serevr started on port "+ port);
    // but just the ES6 way of doing it
});
