const User = require('../models/user');

const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.redirectTo = req.originalUrl;
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/");
};

module.exports = middlewareObj;




// .post(function(req, res) {
//         var item = new Item();
//         item.name = req.body.name;
//         item.description = req.body.description;
//         item.price = req.body.price;

//         item.save(function(err) {
//             if (err) {
//                 res.send(err);
//             }
//             res.json({message: "Item was successfully saved"});
//             console.log(item);
//         })
//     });