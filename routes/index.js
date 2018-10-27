const express = require("express");
const router = express.Router();
const passport = require("passport");
const notp = require("../middleware/otp");
const path = require("path");
var key = "12345678901234567890";
var time = 0;
var HMAC = "755224";
var opt = {
  window: 0
};

const auth = require(path.join(
  __dirname,
  "..",
  "middleware",
  "authentication"
));

const database = require(path.join(__dirname, "..", "services", "user.js"));
/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Crypto" });
});

router.get("/register", (req, res, next) => {
  res.render("register", { title: "Crypto" });
});

router.post("/register", function(req, res, next) {
  return database
    .addUser(req.body)
    .then(function() {
      passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
      })(req, res, function() {
        res.redirect("/home");
      });
    })
    .catch(next);
});

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Crypto" });
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/2step",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/2step", (req, res, next) => {
  // // make sure we can not pass in opt
  // notp.totp.gen(key);

  // // counterheck for test vector at 59s
  // opt._t = 59 * 1000;
  // console.log(notp.totp.gen(key, opt));
  console.log(notp.totp.gen(key, opt));
  console.log(notp.hotp.gen(HMAC, key, opt));
  time = notp.totp.gen(key, opt);
  res.render("form", { title: "Crypto" });
});

router.post("/2step", (req, res, next) => {
  if (req.body.TOTP == time && req.body.HOTP == notp.hotp.gen(HMAC, key, opt)) {
    console.log("Yay its Authenicated");
    res.render("success");
  }
});

module.exports = router;
