var express = require('express');
var router = express.Router();
var Medicine=require('../models/medicine');
var Comment=require('../models/comment');
var User = require('../models/user');
var Email = require('../models/email')
var middleware = require("../middleware");



router.get("/", function(req , res){

    Medicine.find({}, function(err , allmedicine){
        if(err)
        console.log(err);
        else  res.render("medicine/index",{medicines :allmedicine});
    });
});

router.post("/", middleware.isLoggedIn ,function(req, res){

    var authorUser = { id : req.user._id , username : req.user.username};
    var newMedicine = {name : req.body.name , time : req.body.time , remarks:req.body.remarks , author:authorUser};
    var Emailtime = req.body.time;
    var newEmail={time : '' , email :''};

    User.findById(newMedicine.author.id , function(err, foundUser){
        if(err)
        console.log(err);
        else{
             newEmail.time = newMedicine.time;
             newEmail.email =foundUser.email;
             newEmail.msg   = newMedicine.remarks;
             newEmail.medicine_name =newMedicine.name;
             Email.create(newEmail);
        }
    });
    
   
   Medicine.create(newMedicine , function(err , newMedicine){
       if(err)
        console.log(err);
       else {
           
           res.redirect("/medicine");
       }
   });
});


router.get("/new" ,middleware.isLoggedIn , function(req, res){
    res.render("medicine/new");
});


router.get("/:id", function(req , res){
    Medicine.findById(req.params.id).populate('comments').exec( function(err , foundMedicine){
        if(err)
        console.log(err);
        else res.render("medicine/show" ,{ medicines : foundMedicine });
    });
});

router.get("/:id/edit", middleware.checkMedicineOwnership,function(req, res){
   

            Medicine.findById(req.params.id , function(err, medicine){
                    if(err)
                    console.log(err);
                    else
                    res.render("medicine/edit",{ medicine: medicine });
            });
   
});

router.put("/:id",middleware.checkMedicineOwnership ,function(req,res){
    Medicine.findByIdAndUpdate(req.params.id , req.body.medicine , function(err , done){
        if(err)
        console.log(err);
        else res.redirect("/medicine/"+req.params.id);
    })
})

router.delete("/:id",middleware.checkMedicineOwnership ,function(req, res){
    Medicine.findByIdAndRemove(req.params.id, function(err){
        if(err)
        console.log(err);
        else res.redirect("/medicine");
    });
});



module.exports= router;