var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/login", function(req, res) {
  res.render("auth/login");
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("error", "The username or password was incorrect");
      return res.redirect("/");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      var redirectTo = req.session.redirectTo
        ? req.session.redirectTo
        : "/products/inventory/" + user._id;
      delete req.session.redirectTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

router.get("/register", function(req, res) {
  res.render("auth/register");
});

router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    loggedIn: false
  });

  if (req.body.adminCode === process.env.ADMIN_CODE) {
    newUser.isAdmin = true;

    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("auth/register");
      }
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to BCP " + user.username);
        res.redirect("/products/inventory/" + user._id);
      });
    });
  } else {
    req.flash(
      "error",
      "You must have the supplied admin code to create an account"
    );
    res.redirect("/");
  }
});

router.get("/logout",function(req, res) {
  req.logout();
  req.flash("success", "Logged You Out");
  res.redirect("/");
  User.loggedIn = false;
});

module.exports = router;
