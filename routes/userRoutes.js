const router = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user/user.model");
const checkTokenMiddleware = require("../middleware/check-token");
const userExistsMiddleware = require("../middleware/user-exists");

const userRouter = router();

userRouter.get("/:id", checkTokenMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ _id: id }, { password: 0 });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: "Usuário não encontrado !" });
  }
});

userRouter.patch("/", checkTokenMiddleware, async (req, res) => {
  const id = req.user.id;
  const { name, email, password, confirmPassword } = req.body;

  const dataUser = { name: name, email: email };

  if (password) {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "As senhas não conferem" });
    } else if (password === confirmPassword && password !== null) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      dataUser.password = passwordHash;
    }
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: dataUser },
      { new: true }
    );

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = userRouter;
