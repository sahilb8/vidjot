const express =require("express");

const app = express();

//INDEX ROUTE
app.get("/",(req,res)=>{
    res.send("<h1>Hello World</h1>");
});

//ABOUT ROUTE
app.get("/about",(req,res)=>{
    res.send("This is the about page");
});
const port = 5000;
//the ()=> indicates callback function, same as function()
app.listen(port,()=> {
    console.log(`The server started on port ${port}`);
    // same as doing console.log("The serevr started on port "+ port);
    // but just the ES6 way of doing it
});
