const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/user");
const Item = require("../models/items");
const SoldItem = require("../models/soldItems");
const middleware = require("../middleware");
const async = require("async");
const fs = require("fs");

// Set up multer for storing images
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads");
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({ storage: storage }).single("image");

// /products route
router.get("/", (req, res) => {
  Item.find({}, (err, allItems) => {
    if (err) {
      req.flash("error", "Could not find any Items");
      res.redirect("back");
    } else {
      res.render("products/products", { items: allItems });
    }
  });
  // Promise.all([User.findById(req.user._id), Item.find({})])
  //   .then(results => {
  //     let [userDetails, items] = results;
  //     return res.render("products/products", { items: items, user: userDetails });
  //   })
  //   .catch(err => {
  //     return console.log("err", err.stack);
  //   });
});

// /products/inventory/user_id route
router.get("/inventory/:id", middleware.isLoggedIn, function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err || !foundUser) {
      req.flash("error", "Something went wrong");
      res.render("index");
    } else {
      Item.find()
        .where("createdBy.id")
        .equals(foundUser._id)
        .exec(function(err, items) {
          if (err || !foundUser) {
            req.flash("error", "Something went wrong");
            res.render("index");
          }
          res.render("products/inventory", {
            user: foundUser,
            items: items
          });
        });
    }
  });
});

// /products/item/add route
router.get("/item/add", middleware.isLoggedIn, (req, res) => {
  res.render("products/addItem");
});

// /products/item/add post route
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
        var noImage = "/uploads/no-img/no-image.png";
      }
      var description = req.body.description;
      var price = req.body.price;
      var createdBy = { id: req.user._id, username: req.user.username };
      var quantity = req.body.quantity;
      var itemType = req.body.itemType;
      var palletNumber = req.body.palletNumber;
      var newItem = {
        name: name,
        image: image,
        noImage: noImage,
        description: description,
        price: price,
        createdBy: createdBy,
        quantity: quantity,
        itemType: itemType,
        palletNumber: palletNumber
      };
      Item.create(newItem, (err, newlyCreated) => {
        if (err) {
          req.flash("error", err.message);
          res.redirect("back");
        } else {
          user.items.push(newlyCreated);
          user.save();
          res.redirect("/products/inventory/" + req.user._id);
        }
      });
    });
  });
});

// /products/item/item_id route
router.get("/item/:id", (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    if (err) {
      console.log(err);
    } else {
      res.render("products/item", { item: foundItem });
    }
  });
});

router.get("/item/:id/sellitem", (req, res) => {
  Item.findById(req.params.id, (err, foundItem) => {
    if (err) {
      console.log(err);
    } else {
      res.render("products/sell", { item: foundItem });
    }
  });
});

router.post("/item/:id", middleware.isLoggedIn, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    // Do casting manually because you really want to
    let soldPrice = parseFloat(req.body.soldPrice);
    let soldQuantity = parseInt(req.body.soldQuantity);
    let soldDate = Date.now();
    let totalPrice = soldPrice * soldQuantity;

    let refItem = {
      id: item._id,
      item: item.name,
      askPrice: item.price,
      palletNumber: item.palletNumber
    };

    // create the sold item
    let newSoldItem = await SoldItem.create({
      refItem,
      soldPrice,
      soldQuantity,
      totalPrice
    });

    // update the item
    await item.update({ $inc: { quantity: soldQuantity * -1 } });

    // Then respond
    req.flash("success", "Item Sold");
    res.redirect("/products");
  } catch (e) {
    console.log("err", e.stack);
    // really should send the error on res here as well
  }
});

// /products/item/item_id delete route
// router.delete("/item/:id", middleware.isLoggedIn, (req, res) => {
//   Promise.all([
//     User.update({ _id: req.user._id }, { $pull: { items: req.params.id } }),
//     Item.findById(req.params.id, (err, item) => {
//       if (err) {
//         console.log(err);
//       } else {
//         fs.unlinkSync(__dirname + "../../public" + item.image);
//       }
//     }),
//     fs
//       .createReadStream(__dirname + "../../public/uploads/backup/no-image.png")
//       .pipe(
//         fs.createWriteStream(
//           __dirname + "../../public/uploads/no-img/no-image.png"
//         )
//       ),
//     Item.findByIdAndRemove(req.params.id)
//   ])
//     .then(() => {
//       req.flash("success", "Item Deleted");
//       res.redirect("back");
//     })
//     .catch(err => {
//       return console.log("err", err.stack);
//     });
// });

router.delete("/item/:id", middleware.isLoggedIn, async(req, res) => {
  try {
    User.update({ _id: req.user._id }, { $pull: { items: req.params.id } });
    Item.findByIdAndRemove(req.params.id);
    req.flash("Success", "Item Deleted");
    res.redirect("back");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
