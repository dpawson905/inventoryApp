const mongoose = require("mongoose");
const User = require("./user");
const Item = require("./items");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Item name must be more than 3 characters long"],
      maxlength: 50
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    image: String,
    noImage: String,
    createdBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    },
    quantity: Number,
    itemType: String,
    palletNumber: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Items", ItemSchema);
