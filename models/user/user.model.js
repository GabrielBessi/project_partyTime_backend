const mongoose = require("mongoose");
const userSchema = require("../../schemas/user/createUser.schema");

const User = mongoose.model("User", userSchema);

module.exports = User;
