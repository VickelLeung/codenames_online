const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  name: { type: String, require: true },
});

const Cards = mongoose.model("Cards", cardSchema);

module.exports = Cards;
