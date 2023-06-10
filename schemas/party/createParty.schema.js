const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  partyData: {
    type: String,
  },
  photos: {
    type: Array,
  },
  privacy: {
    type: Boolean,
  },
  userId: {
    type: mongoose.ObjectId,
  },
});

module.exports = PartySchema;
