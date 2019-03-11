var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var assert = require("assert");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mongoose = require("mongoose");
const passport = require("passport");
const localstrategy = require("passport-local");
var notp = require("./middleware/otp");
var app = express();
const session = require("express-session");
const auth = require("./middleware/authentication");
require("dotenv").config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/crypto");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "Ferrari 488GTB",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//hmmm hmmm

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Test of two step authentication

// var key = "12345678901234567890";
// var opt = {
//   window: 0
// };
// var HOTP = [
//   "755224",
//   "287082",
//   "359152",
//   "969429",
//   "338314",
//   "254676",
//   "287922",
//   "162583",
//   "399871",
//   "520489"
// ];

// // make sure we can not pass in opt
// notp.hotp.verify("WILL NOT PASS", key);

// // counterheck for failure
// opt.counter = 0;
// assert.ok(!notp.hotp.verify("WILL NOT PASS", key, opt), "Should not pass");
// console.log("Yo");
// // counterheck for passes
// for (i = 0; i < HOTP.length; i++) {
//   opt.counter = i;
//   var res = notp.hotp.verify(HOTP[i], key, opt);
// }

// var key = "12345678901234567890";
// var opt = {
//   window: 0
// };

// // make sure we can not pass in opt
// notp.totp.gen(key);

// // counterheck for test vector at 59s
// opt._t = 59 * 1000;
// console.log(notp.totp.gen(key, opt));
// assert.equal(notp.totp.gen(key, opt), "236658", "TOTtoken values should match");

module.exports = app;
