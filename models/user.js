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
      required: [true, "Username is required"],
      minlength: [5, "Username must be at least 5 characters long"],
      maxlength: [15, "Username cannot excede 15 characters"]
    },
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
      maxlength: [15, "First name cannot excede 15 characters"]
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [15, "Last name cannot excede 15 characters"]
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
