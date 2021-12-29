const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String,unique: true },
  password: { type: String },
  phone: Number,
  portfolio_size: Number,
  profile_precentage: Number,
  avatar: Buffer,
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
