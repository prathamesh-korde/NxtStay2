const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { required } = require("joi");
const {saveRedtecturl} = require("../middleware.js")
const userControl = require("../controllers/user.js");

router.route("/signup")
.get(userControl.renderSignUpForm)
.post(wrapAsync(userControl.signUpUser));


router.route("/login")
.get(userControl.renderLodinForm)
.post(saveRedtecturl,passport.authenticate('local',{failureRedirect:'/login', failureFlash:true}),userControl.login);


router.get("/logout",userControl.logout)


module.exports = router;

