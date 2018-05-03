var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Items = require("../models/items");

router
  .route("/login")
  .get(function(req, res) {
    res.render("login");
  })

  .post(function(req, res, next) {
    passport.authenticate("local", function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/");
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        var redirectTo = req.session.redirectTo
          ? req.session.redirectTo
          : "/products";
        delete req.session.redirectTo;
        res.redirect(redirectTo);
      });
    })(req, res, next);
  });

router
  .route("/register")
  .get(function(req, res) {
    res.render("register");
  })

  .post(function(req, res) {
    var newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      loggedIn: false
    });

    if (req.body.adminCode === "bcp") {
      newUser.isAdmin = true;

      User.register(newUser, req.body.password, function(err, user) {
        if (err) {
          req.flash("error", err.message);
          res.redirect("/auth/register");
        }
        passport.authenticate("local")(req, res, function() {
          req.flash("success", "Welcome to BCP " + user.username);
          res.redirect("/products");
        });
      });
    } else {
      req.flash("error", "You must have the supplied admin code to create an account");
      res.redirect("/");
    }
  });

router.route("/logout").get(function(req, res) {
  req.logout();
  req.flash("success", "Logged You Out");
  res.redirect("/");
  User.loggedIn = false;
});

module.exports = router;
