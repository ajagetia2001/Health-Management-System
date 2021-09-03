var mongoose = require("mongoose");

var emailSchema = new mongoose.Schema({
    time:String,
    email:String,
    msg:String,
    medicine_name:String
});

module.exports = mongoose.model("Email", emailSchema);