const mongoose = require("mongoose");

const user = mongoose.Schema({
   name:String,
   email:String,
   phone:Number,
   portfolio_size:Number,
   profile_precentage:Number,
   avatar:Buffer,
})

module.exports = user;