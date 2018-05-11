const mongoose = require("mongoose");
const User = require("./user");
const Item = require("./items");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
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
    itemType: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Items", ItemSchema);
