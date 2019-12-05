const express =require("express");
const exphbs  = require('express-handlebars');

const app = express();


//how middleware works
// app.use(function(req,res,next){
//     console.log(Date.now());
//     req.name="Sahil";
//     next();
// });


//HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

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
const port = 5000;
//the ()=> indicates callback function, same as function()
app.listen(port,()=> {
    console.log(`The server started on port ${port}`);
    // same as doing console.log("The serevr started on port "+ port);
    // but just the ES6 way of doing it
});
