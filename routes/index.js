var express = require('express');
var router = express.Router();
var passport=require('passport');
var User=require('../models/user');

router.get("/", function(req , res){
    res.render("landing");;
});




router.get("/register", function(req, res){
    res.render("register"); 
 });
 //handle sign up logic
 router.post("/register", function(req, res){
     var newUser = new User({username: req.body.username, email: req.body.email});
     User.register(newUser, req.body.password, function(err, user){
         if(err){
             console.log(err);
             return res.render("register");
         }
         passport.authenticate("local")(req, res, function(){
            req.flash("success","Successfully Registered")
            res.redirect("/medicine"); 
         });
     });
 });
 
 // show login form
 router.get("/login", function(req, res){
    res.render("login"); 
 });
 // handling login logic
 router.post("/login", passport.authenticate("local", 
     {  
         successRedirect: "/medicine",
         failureRedirect: "/login"
     }), function(req, res){
 });
 
 // logic route
 router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","Successfully logged out");
    res.redirect("/medicine");
 });
 
 function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;