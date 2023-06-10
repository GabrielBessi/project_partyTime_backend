const mongoose = require("mongoose");
const PartySchema = require("../../schemas/party/createParty.schema");

const Party = mongoose.model("Party", PartySchema);

module.exports = Party;
