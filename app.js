//jshint esversion:6
require("dotenv").config();
const express =require("express");
const bodyparser = require("body-parser");
const ejs= require("ejs");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("Public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =  new mongoose.Schema({email: String, password: String });



const User = mongoose.model("User",userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});


app.get("/login", function(req, res){
    res.render("login");
});

app.post("/register", function(req,res){
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user = new User({
            email: req.body.username,
            password: hash
        });

        user.save(function(err){
            if(!err)
            res.render("secrets");
            else
            console.log(err);
        });
    });

    
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email: username},function(err, founduser){
        if(!err)
        {  if(founduser)
             bcrypt.compare(password, founduser.password, function(err, result) {
            if(result==true)
            res.render("secrets");

        });
         
        }
        else 
        console.log(err);
    })
})
















app.listen(3000, function(){
    console.log("server is running on 30000");
})