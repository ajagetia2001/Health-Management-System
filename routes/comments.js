var express = require('express');
var router = express.Router({mergeParams:true});
var Medicine=require('../models/medicine');
var Comment=require('../models/comment');
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn ,function(req, res){
    Medicine.findById(req.params.id, function(err, foundMedicine){
        if(err)
        console.log(err);
        else{
            // console.log(req.params.id);
            // console.log(medicine);
            res.render("comments/new",{medicine: foundMedicine});
            
        }
    })
});

router.post("/", middleware.isLoggedIn ,function(req, res){
    Medicine.findById(req.params.id, function(err, foundMedicine){
        if(err)
        console.log(err);
        else{
            // console.log(req.body.comment);
            Comment.create(req.body.comment, function(err , comment){
                if(err)
                console.log(err);
                else{
                    // console.log(comment);
                    comment.author.id = req.user.id;
                    
                    comment.author.username = req.user.username;
                    // console.log(comment);
                    comment.save();
                    foundMedicine.comments.push(comment);
                    foundMedicine.save();
                    // console.log(foundMedicine.find().populate('comments'));
                    res.redirect("/medicine/"+ foundMedicine._id);

                }
            })
        }
    })
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req, res){
    Comment.findById(req.params.comment_id, function(err , foundComment){
        if(err)
        {
            
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{medicine_id : req.params.id , comment:foundComment });
        }
    })
   
});

router.put("/:comment_id", middleware.checkCommentOwnership , function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , function(err , done){
        if(err){
            res.redirect("bback");
        }
        else{


            res.redirect("/medicine/"+req.params.id);
        }
    } );
});

router.delete("/:comment_id", middleware.checkCommentOwnership ,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err,done){
        if(err)
        res.redirect("back");
        else{
            res.redirect("/medicine/"+req.params.id);
        }
    });
});



module.exports=router;