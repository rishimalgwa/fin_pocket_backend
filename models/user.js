const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
   name:{type:String},
   email:{type:String},
   password:{type:String},
   phone:Number,
   portfolio_size:Number,
   profile_precentage:Number,
   avatar:Buffer,
})
userSchema.pre('save',async function (next){
   const user =this
   if (user.isModified('password')) {
     user.password = await bcrypt.hash(user.password,8);
   }
next()
})
const User= mongoose.model('Users',userSchema);

module.exports = User;