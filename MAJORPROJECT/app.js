// ===== ENVIRONMENT CONFIGURATION =====
// Load environment variables from .env file in development mode
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// ===== DEPENDENCIES =====
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL; // MongoDB Atlas cloud database URL
// const mongo_URL = "mongodb://127.0.0.1:27017/NxtStay"; // Local database (not used)

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

// ===== DATABASE CONNECTION =====
async function main() {
  await mongoose.connect(dbUrl);
}

// ===== VIEW ENGINE & MIDDLEWARE SETUP =====
app.set("view engine","ejs"); // Use EJS for templates
app.set("views",path.join(__dirname,"views")); // Set views directory
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method")); // Support PUT/DELETE methods in forms
app.use(express.json()); // Parse JSON data
app.engine("ejs",ejsMate); // Use ejs-mate for layouts
app.use(express.static(path.join(__dirname,"/public"))); // Serve static files (CSS, JS, images)


// ===== SESSION STORAGE IN MONGODB =====
// Store user sessions in MongoDB for persistence across server restarts
const store = MongoStore.create({
  mongoUrl: dbUrl, // Store sessions in MongoDB Atlas
  touchAfter: 24 * 60 * 60, // Update session every 24 hours (86400 seconds)
  crypto: {
    secret:process.env.SECRET, // Encrypt session data
  } 
});

store.on("error", ()=>{
  console.log("Session store error"+ err);
});

// Session configuration options
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

 
// ===== SESSION & FLASH MESSAGES =====
app.use(Session(options)); // Enable sessions
app.use(flash()); // Enable flash messages for success/error notifications

// ===== AUTHENTICATION SETUP (PASSPORT.JS) =====
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Enable persistent login sessions
passport.use(new LocalStrategy(User.authenticate())); // Use username/password authentication

passport.serializeUser(User.serializeUser()); // Store user in session
passport.deserializeUser(User.deserializeUser()); // Retrieve user from session

// Make flash messages and current user available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Success messages
  res.locals.error = req.flash("error"); // Error messages
  res.locals.Curruser = req.user; // Current logged-in user
  next();
});

// ===== AI CHATBOT (GEMINI API) =====
// Backend proxy route for AI chatbot - handles user messages and returns AI responses
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Gemini API key from .env
    
    // System context - defines chatbot's role and behavior
    const systemContext = `You are a helpful assistant for NxtStay, a vacation rental platform similar to Airbnb. Help users with booking properties, listing their homes, searching destinations, and answering questions about the platform. Be friendly, concise, and helpful.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemContext }] },
            ...conversationHistory,
            { role: 'user', parts: [{ text: message }] }
          ]
        })
      }
    );

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that.';
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== ROUTES =====
app.use("/Listings",Listings); // Property listing routes (view all, create, edit, delete)
app.use("/listings/:id/reviews",reviews); // Review routes (add, delete reviews)
app.use("/",UserRoute); // User authentication routes (signup, login, logout)

// ===== ERROR HANDLING =====
// Handle 404 - Page not found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global error handler - renders error page
app.use((err,req,res,next) =>{
  let{status=500, message = "Something went wrong"} = err;
  res.status(status).render("listings/error.ejs",{message});
})

// ===== SERVER START =====
// Start server only in development (not on Vercel serverless)
if (process.env.VERCEL !== '1') {
  app.listen(8080, () => {
    console.log("Server listening on port 8080");
  });
}

// Export app for Vercel serverless deployment
module.exports = app;




