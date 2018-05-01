const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Item = require("../models/items");
const middleware = require("../middleware");

router.route("/").get(function(req, res) {
  Item.find({}, function(err, allItems) {
    if (err) {
      cosole.log(err);
    } else {
      res.render("products", { items: allItems });
    }
  });
});

router
  .route("/item/add")
  .get(middleware.isLoggedIn, function(req, res) {
    res.render("addItem");
  })

  .post(function(req, res) {
    User.findById(req.user._id, function(user, err) {
      if (err) {
        console.log(err);
      }
      var item = new Item();
      item.name = req.body.name;
      item.description = req.body.description;
      item.price = req.body.price;
      item.createdBy = { id: req.user._id, username: req.user.username };

      item.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "Item was successfully saved" });
        console.log(item);
      });
    });
  });

router.route("/item/:item")
  .get(function(req, res) {
    res.send("Welcome to the specific item page");
  })

  .delete(function(req, res) {
    Item.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
        req.flash("error", err);
        res.redirect('back');
        console.log(req.params.id);
      } else {
        req.flash("success", "Deleted")
        res.redirect('back');
        console.log(req.params.id);
      }
    });
  })

module.exports = router;
