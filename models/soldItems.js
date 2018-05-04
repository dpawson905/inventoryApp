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
  },
  soldQuantity: String,
  askPrice: Number,
  soldPrice: Number,
  totalPrice: {
    $multiply: ["$quantity", "$soldPrice"]
  }
});

module.exports = mongoose.model("soldItems", SoldItemSchema);