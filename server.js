const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const partyRouter = require("./routes/partyRoutes");

mongoose.connect("mongodb://127.0.0.1:27017/partyTime", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Configurações gerais
const db = mongoose.connection;
const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//Rotas
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/party", partyRouter);

//Conectando com mongoose e mongoDB
db.on("error", console.error.bind(console, "connection error: "));

db.once("open", function () {
  console.log("Conectado ao mongoDB !!!");
});

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
