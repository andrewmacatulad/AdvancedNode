const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = () => {
  // return User.remove({ googleId: { $nin: ["100855612373275209843"] } }).then(
  return User.remove({ googleId: { $exists: false } }).then(() => {
    return new User({}).save();
  });
};
