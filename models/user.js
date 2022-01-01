const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String,unique: true },
  password: { type: String },
  phone: Number,
  portfolio_size: Number,
  profile_precentage: Number,
  avatar: Buffer,
  tokens:[
    {
      token:{
        type:String,
        require:true
      }
    }
  ]
});

userSchema.statics.findByCredintials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};
userSchema.methods.generateAuthToken = async function ()  {
  const user = this
  var token = jwt.sign({_id:user._id.toString()},'RISHIISCOOL');
  user.tokens = user.tokens.concat({token});
  await user.save()
  return token;
};
userSchema.methods.toJSON =  function ()  {
  const user = this
  const userObj = user.toObject()
  delete userObj.password
  delete userObj.tokens
  return userObj;
};

// hashing password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
