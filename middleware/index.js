var middlewareObj = {};
var Medicine = require("../models/medicine");
var Comment = require("../models/comment");

middlewareObj.checkMedicineOwnership = function(req,res,next){

    if(req.isAuthenticated()){

        Medicine.findById(req.params.id , function(err, medicine){
            if(medicine.author.id.equals(req.user.id)){
                
                next();
            }
            else{
               res.redirect("back");
            }

        });
    

}
else{
    res.redirect("back");
}
}

middlewareObj.checkCommentOwnership = function(req,res,next){

    if(req.isAuthenticated()){

        Comment.findById(req.params.comment_id , function(err, comment){
            if(comment.author.id.equals(req.user.id)){
                
                next();
            }
            else{
               res.redirect("back");
            }

        });
    

}
else{
    res.redirect("back");
}
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){

        return next();
    }
    req.flash("error","You need to be logged in");
    res.redirect("/login");
}



module.exports = middlewareObj