var express= require('express');
var router=express.Router();
var User=require('../models/users');
var passport=require("passport"),
    LocalStrategy=require("passport-local");

//Routes
router.get("/", function(req,res) {
    res.render("landing");
});

//Auth routes
router.get("/register", function(req, res){
    res.render("register")
});

//signup logic
router.post("/register", function(req, res){
    var newUser= new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    })
});

//login
router.get("/login", function(req, res){
    res.render("login");
});
router.post("/login", passport.authenticate("local", 
        {successRedirect: "/campgrounds",
        failureRedirect: "/login"}), function(req, res){

});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged Out!")
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;