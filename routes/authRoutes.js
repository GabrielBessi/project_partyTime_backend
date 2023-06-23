const router = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user/user.model");
require("dotenv").config();

const userRouter = router();

//register user
userRouter.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (name == null || email == null || password == null) {
    return res
      .status(400)
      .json({ error: "Por favor, preencher todos os campos !" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "As senhas precisam ser iguais" });
  }

  const emailExists = await User.findOne({ email: email });

  if (emailExists) {
    return res.status(400).json({ message: "Email existente !" });
  }

  const cryptPassword = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, cryptPassword);

  const user = new User({
    name: name,
    email: email,
    password: passwordHash,
  });

  try {
    const newUser = await user.save();

    const token = jwt.sign(
      {
        name: newUser.name,
        id: newUser._id,
      },
      "KEYSECRET"
    );
    res.json({
      message: "Usuário criado com sucesso",
      userId: newUser._id,
      token: token,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

//login
userRouter.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: "Email ou senha inválidos" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({ error: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      process.env.KEYSECRET
    );

    return res.status(200).json({
      userId: user._id,
      message: "Login realizado com sucesso",
      token: token,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = userRouter;
