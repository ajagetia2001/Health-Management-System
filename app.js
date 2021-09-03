var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    methodOverride= require('method-override'),
    mongoose    = require('mongoose'),
    seedDB      = require("./seed"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Medicine    = require("./models/medicine"),
    User        = require('./models/user'),
    flash       = require('connect-flash'),
    Comment     = require("./models/comment"),
    Email       =require('./models/email')
    Time        = require('./email/index'),
    moment      = require('moment'),
    nodemailer  = require('nodemailer');

var cron = require('node-cron');


var medicineRoutes = require('./routes/medicine'),
    authRoutes     = require('./routes/index'),
    commentRoutes  = require('./routes/comments');


// mongoose.connect("mongodb://localhost/medicine_reminder",{ useUnifiedTopology: true,  useNewUrlParser: true });
mongoose.connect("mongodb+srv://pranav:pranav@medilona-cqh12.mongodb.net/test?retryWrites=true&w=majority",{ useUnifiedTopology: true,  useNewUrlParser: true })
app.use(flash());
app.use(bodyParser.urlencoded({extended: true,   useNewUrlParser: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// seedDB();

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error =req.flash('error');
   res.locals.success=req.flash('success');
   next();
});

app.use("/medicine/:id/comments",commentRoutes);
app.use("/medicine",medicineRoutes);
app.use(authRoutes);

// setInterval(Time  , 1000);

cron.schedule('* * * * *', () => {
    Time();
  });


app.listen(3000||process.env.PORT, process.env.IP, function(){
    console.log("The MediLona Server Started");
 });

