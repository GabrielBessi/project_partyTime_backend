const jwt = require("jsonwebtoken");
const User = require("../models/user/user.model");
require("dotenv").config();

const getUserTokenMiddleware = async (token) => {
  if (!token) {
    return res.status(401).json({ error: "Acesso Negado" });
  }

  const tokenAuth = token.split(" ")[1];

  const decoded = jwt.verify(tokenAuth, process.env.KEYSECRET);

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};

module.exports = getUserTokenMiddleware;
