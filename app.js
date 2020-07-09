var express=require("express"),
        app=express(),
        bodyParser=require("body-parser"),
        mongoose=require("mongoose"),
        passport=require("passport"),
        methodOverride=require('method-override'),
        LocalStrategy=require("passport-local"),
        User=require('./models/users'),
        flash=require('connect-flash'),
        seedDB=require('./seeds');
   
var indexRoutes= require("./routes/index"),
    commentRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds")
// seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_11", {useUnifiedTopology: true, useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());


//Passport
app.use(require("express-session")({
    secret: "pfioo",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.user=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT || 3000, function(){
    console.log("YelpCamp has started!");
});


// Campground.create(
    // {
    //     name: "Granite Hill",
    //     image: "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    //     description: "This is a granite hill."
    // },
//     function(err, campground){
//         if(err){
//             console.log(err);
//         } else{
//             console.log("new campground");
//         }
//     }
// );