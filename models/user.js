const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Item = require("./items");
const User = require("./user");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 15
    },
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Items"
      }
    ],
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
