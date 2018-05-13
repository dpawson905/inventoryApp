const mongoose = require("mongoose");
const User = require("./user");
const Item = require("./items");
const SoldItem = require("./soldItems");

const SoldItemSchema = new mongoose.Schema(
  {
    refItem: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Items"
      },
      item: String,
      name: String,
      askPrice: mongoose.Schema.Types.Decimal128,
      palletNumber: Number
    },
    soldQuantity: Number,
    soldPrice: mongoose.Schema.Types.Decimal128,
    totalPrice: mongoose.Schema.Types.Decimal128,
    soldDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoldItems", SoldItemSchema);