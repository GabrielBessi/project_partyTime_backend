const User = require("../models/user/user.model");

const userExistsMiddleware = async (req, res, next) => {
  const idParams = req.params.id;
  const idToken = req.user.id;

  if (idParams) {
    if (idParams !== idToken) {
      return res.status(400).json({ message: "Erro ao atualizar o usuário" });
    }
  }

  const userExists = await User.findOne({ _id: idToken });

  if (!userExists) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  next();
};

module.exports = userExistsMiddleware;
