const mongoose = require("mongoose");
const User = require("./user");
const Item = require("./items");
const SoldItem = require("./soldItems");

const SoldItemSchema = new mongoose.Schema({
  soldItem: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Items"
    },
    item: String,
    name: String,
    askPrice: Number
  },
  soldQuantity: Number,
  soldPrice: Number,
});

module.exports = mongoose.model("SoldItems", SoldItemSchema);