const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "Acesso negado" });
  }

  const tokenAuth = token.split(" ")[1];

  jwt.verify(tokenAuth, process.env.KEYSECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: error.message });
    }

    req.user = {
      id: decoded.id,
    };

    return next();
  });
};

module.exports = checkTokenMiddleware;
