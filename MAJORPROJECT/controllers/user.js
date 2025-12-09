const User = require("../models/user.js");

// ===== RENDER SIGNUP FORM =====
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs")
}

// ===== SIGNUP NEW USER =====
// Registers new user and automatically logs them in
module.exports.signUpUser=async (req, res,next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password); // Hash password and save user
      // Auto-login after signup
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }

        req.flash("success", "Welcome to NxtStay!");
      res.redirect("/listings");
      })
      
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLodinForm = (req,res)=>{
  res.render("users/login.ejs");
}

// ===== LOGIN USER =====
// Redirects to saved URL or home page after successful login
module.exports.login=async(req,res)=>{
  req.flash("success", "Welcome back to NxtStay!");
  let redirectUrl = res.locals.redirectUrl || "/listings"; // Redirect to previous page or home
  res.redirect(redirectUrl)
}

// ===== LOGOUT USER =====
// Logs out user and redirects to home page
module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You have successfully logged out from NxtStay!")
    res.redirect("/listings");
  })
}
