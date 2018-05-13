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
