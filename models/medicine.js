var mongoose = require("mongoose");

var medicineSchema = new mongoose.Schema({
    name:String,
    time:String,
    remarks:String,
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Medicine", medicineSchema);