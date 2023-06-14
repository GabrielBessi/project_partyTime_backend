const router = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Party = require("../models/party/party.model");
const User = require("../models/user/user.model");

const checkTokenMiddleware = require("../middleware/check-token");
const userExistsMiddleware = require("../middleware/user-exists");
const diskStorageMiddleware = require("../middleware/file-storage");
const getUserTokenMiddleware = require("../middleware/get-user-toke");

const upload = multer({ storage: diskStorageMiddleware });
const partyRouter = router();

partyRouter.post(
  "/",
  checkTokenMiddleware,
  userExistsMiddleware,
  upload.fields([{ name: "photos" }]),
  async (req, res) => {
    const { title, description, partyDate, privacy } = req.body;
    let files = [];

    if (req.files) {
      files = req.files.photos;
    }

    if (title === "null" || description === "null" || partyDate === "null") {
      return res
        .status(400)
        .json({ message: "Preencha os campos nome, descrição e data" });
    }

    const id = req.user.id;

    try {
      const user = await User.findOne({ _id: id });

      let photos = [];

      if (files && files.length > 0) {
        files.forEach((photo, i) => {
          photos[i] = photo.path;
        });
      }

      const party = new Party({
        title: title,
        description: description,
        photos: photos,
        privacy: privacy,
        userId: user._id.toString(),
      });

      try {
        const newParty = await party.save();

        return res
          .status(200)
          .json({ message: "Festa criada com sucesso", data: newParty });
      } catch (error) {
        return res.status(400).json({ error });
      }
    } catch (error) {
      return res.status(400).json({ message: "Acesso Negado" });
    }
  }
);

partyRouter.get("/all", async (req, res) => {
  try {
    const parties = await Party.find({ privacy: false }).sort([["_id", -1]]);

    return res.status(200).json(parties);
  } catch (error) {
    return res.status(400).json(error);
  }
});

partyRouter.get("/userparties", checkTokenMiddleware, async (req, res) => {
  const id = req.user.id;

  try {
    const partiesUser = await Party.find({ userId: id });

    return res.status(200).json(partiesUser);
  } catch (error) {
    return res.status(400).json(error);
  }
});

partyRouter.get("/userparty/:id", checkTokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const partyId = req.params.id;

    const party = await Party.findOne({ _id: partyId, userId: userId });

    return res.status(200).json(party);
  } catch (error) {
    return res.status(400).json(error);
  }
});

partyRouter.get("/:id", async (req, res) => {
  try {
    const partyId = req.params.id;

    const party = await Party.findOne({ _id: partyId });

    if (party.privacy === false) {
      return res.status(200).json(party);
    } else {
      const token = req.headers.authorization;

      const user = await getUserTokenMiddleware(token);

      console.log(user);

      if (party.userId.toString() === user._id.toString()) {
        return res.status(200).json(party);
      } else {
        return res
          .status(404)
          .json({ message: "Ops! Parece que está festa não é para você" });
      }
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Evento não existe ou indisponível" });
  }
});

module.exports = partyRouter;
