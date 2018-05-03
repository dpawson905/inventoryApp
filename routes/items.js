const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const Item = require("../models/items");
const middleware = require("../middleware");

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads");
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({ storage: storage }).single("image");

router.get("/", middleware.isLoggedIn, (req, res) => {
  Promise.all([User.findById(req.user._id), Item.find({})])
    .then(results => {
      let [userDetails, items] = results;
      return res.render("products", { items: items, user: userDetails });
    })
    .catch(err => {
      return console.log("err", err.stack);
    });
});

router.get("/:id", middleware.isLoggedIn, function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err || !foundUser) {
      req.flash("error", "Something went wrong");
      res.render("index");
    } else {
      Item.find()
        .where("creadtedBy.id")
        .equals(foundUser._id)
        .exec(function(err, items) {
          if (err || !foundUser) {
            req.flash("error", "Something went wrong");
            res.render("index");
          }
          console.log("user" + foundUser);
          console.log("items" + items);
          res.render("inventory", {
            user: foundUser,
            items: items
          });
        });
    }
  });
});

router.get("/item/add", middleware.isLoggedIn, (req, res) => {
  res.render("addItem");
});

router.post("/item/add", middleware.isLoggedIn, (req, res) => {
  User.findById(req.user._id, (err, user) => {
    upload(req, res, err => {
      if (err) {
        req.flash("error", "error uploading image");
        return res.redirect("back");
      }
      var name = req.body.name;
      if (typeof req.file !== "undefined") {
        var image = "/uploads/" + req.file.filename;
      } else {
        image = "/uploads/no-img.PNG";
      }
      var description = req.body.description;
      var price = req.body.price;
      var createdBy = { id: req.user._id, username: req.user.username };
      var newItem = {
        name: name,
        image: image,
        description: description,
        price: price,
        createdBy: createdBy
      };
      Item.create(newItem, (err, newlyCreated) => {
        if (err) {
          return console.log(err);
        } else {
          user.items.push(newlyCreated);
          user.save();
          res.redirect("/products");
        }
      });
    });
  });
});

router.get("/item/:id", middleware.isLoggedIn, (req, res) => {
  res.send("Welcome to the items specific page");
});

router.delete("/item/:id", middleware.isLoggedIn, (req, res) => {
  Item.findByIdAndRemove(req.params.id, err => {
    if (err) {
      req.flash("error", err);
      res.redirect("back");
    }
    req.flash("success", "Item Deleted");
    res.redirect("back");
  });
});

module.exports = router;
