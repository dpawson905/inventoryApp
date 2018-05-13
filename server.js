const express = require("express");
const app = express();
const mongoose = require("mongoose");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const helmet = require("helmet");
const session = require("express-session");
const User = require("./models/user");

require("dotenv").config();

const indexRoute = require("./routes/index");
const authRoute = require("./routes/user");
const itemRoute = require("./routes/items");

const port = process.env.PORT || 3001;
const url = process.env.DATABASEURL || "mongodb://localhost:27017/ims";
mongoose.connect(url);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cookieParser());

// Passport config
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoute);
app.use("/products", itemRoute);
app.use("/auth", authRoute);

// this is required for the server to init
app.listen(port, process.env.IP, function() {
  console.log("Congrats, your app is running on port " + port);
});
