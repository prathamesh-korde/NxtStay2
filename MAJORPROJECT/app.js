if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL;
// const mongo_URL = "mongodb://127.0.0.1:27017/NxtStay";

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
var Session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport")
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const {ListingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
 
const Listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const UserRoute = require("./routes/user.js");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
//middleware that parses URL-encoded data (from HTML forms) and makes it available in req.body.
app.use(methodOverride("_method"));
//Express app support HTTP methods like PUT, PATCH, and DELETE in places (like HTML forms) where only GET and POST are allowed.
app.use(express.json()); 
//Express app to automatically parse incoming JSON data in the request body and make it available as req.body.
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60, // time in seconds
  crypto: {
    secret:process.env.SECRET,
  } 
});

store.on("error", ()=>{
  console.log("Session store error"+ err);
});
const options = {
  store,
  secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: false, 
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

 
app.use(Session(options));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.Curruser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   try {
//     let fakeUser = new User({
//       email: "pratham0123@gmail.com", 
//       username: "pratham",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld"); 
//   } catch (e) {
//     res.status(500).send(e.message); 
//   }
// });

app.use("/Listings",Listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",UserRoute);


app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next) =>{
  let{status=500, message = "Something went wrong"} = err;
  res.status(status).render("listings/error.ejs",{message});
})

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});




