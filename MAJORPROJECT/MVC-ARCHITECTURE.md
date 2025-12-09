# NxtStay - MVC Architecture Documentation

## 🏗️ MVC Framework Overview

NxtStay follows the **Model-View-Controller (MVC)** architectural pattern, which separates the application into three interconnected components for better code organization, maintainability, and scalability.

---

## 📊 MVC Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│                    (Web Browser)                            │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP Request
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      ROUTER                                 │
│              (routes/ folder)                               │
│  • Receives HTTP requests                                   │
│  • Maps URLs to controller actions                          │
│  • Applies middleware (auth, validation)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    CONTROLLER                               │
│             (controllers/ folder)                           │
│  • Handles business logic                                   │
│  • Processes user input                                     │
│  • Interacts with Models                                    │
│  • Selects appropriate View                                 │
└────────────┬───────────────────────┬────────────────────────┘
             │                       │
             ↓                       ↓
┌────────────────────────┐  ┌──────────────────────────────┐
│       MODEL            │  │          VIEW                │
│   (models/ folder)     │  │     (views/ folder)          │
│  • Database schemas    │  │  • EJS templates             │
│  • Data validation     │  │  • HTML rendering            │
│  • CRUD operations     │  │  • User interface            │
│  • MongoDB/Mongoose    │  │  • Dynamic content           │
└────────────────────────┘  └──────────────────────────────┘
```

---

## 📁 Folder Structure & MVC Mapping

### **1. Models** (`models/` folder)
**Purpose:** Defines data structure, database schemas, and data validation rules.

**Contains:**
- Database schemas using Mongoose
- Data validation logic
- Relationships between collections
- Model-specific methods

**Files:**
```
models/
├── listing.js          # Property listing schema (title, description, price, location, etc.)
├── review.js           # Review schema (rating, comment, author)
└── user.js             # User authentication schema (email, username, password)
```

**Example:**
```javascript
// models/listing.js
const ListingSchema = new Schema({
  title: String,
  price: Number,
  location: String,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
});
```

---

### **2. Views** (`views/` folder)
**Purpose:** Presents data to the user in HTML format using EJS templates.

**Contains:**
- EJS template files (.ejs)
- HTML structure with embedded JavaScript
- Dynamic content rendering
- Reusable partials and layouts

**Files:**
```
views/
├── layouts/
│   └── boilerpalte.ejs     # Main layout template (header, footer, common structure)
│
├── includes/               # Reusable partials
│   ├── navbar.ejs          # Navigation bar with search and auth links
│   ├── footer.ejs          # Footer section
│   ├── flash.ejs           # Flash messages (success/error notifications)
│   └── chatbot.ejs         # AI chatbot integration
│
├── listings/               # Property listing views
│   ├── index.ejs           # All listings page with category filters
│   ├── show.ejs            # Single listing details with map and reviews
│   ├── new.ejs             # Create new listing form
│   ├── edit.ejs            # Edit listing form
│   └── error.ejs           # Error page
│
└── users/                  # User authentication views
    ├── signup.ejs          # User registration form
    └── login.ejs           # User login form
```

**Example:**
```html
<!-- views/listings/show.ejs -->
<h1><%= listing.title %></h1>
<p>Price: $<%= listing.price %></p>
<% if (Curruser && listing.owner._id.equals(Curruser._id)) { %>
  <button>Edit</button>
<% } %>
```

---

### **3. Controllers** (`controllers/` folder)
**Purpose:** Handles application logic, processes requests, and coordinates between Models and Views.

**Contains:**
- Business logic functions
- Request handling
- Data processing
- Response rendering
- API integrations (Mapbox, Cloudinary)

**Files:**
```
controllers/
├── listing.js              # Listing operations (CRUD, search, filter, geocoding)
├── review.js               # Review operations (create, delete)
└── user.js                 # User operations (signup, login, logout)
```

**Functions in Controllers:**
```javascript
// controllers/listing.js
module.exports.index          // Show all listings with search/filter
module.exports.renderNewForm  // Show create listing form
module.exports.createListing  // Handle new listing submission with geocoding
module.exports.showListing    // Show single listing details
module.exports.editListing    // Show edit form
module.exports.updateListing  // Handle listing update
module.exports.destroyListing // Delete listing

// controllers/review.js
module.exports.createReview   // Add review to listing
module.exports.destroyReview  // Delete review

// controllers/user.js
module.exports.renderSignUpForm // Show signup form
module.exports.signUpUser       // Handle user registration
module.exports.renderLodinForm  // Show login form
module.exports.login            // Handle user login
module.exports.logout           // Handle user logout
```

**Example:**
```javascript
// controllers/listing.js
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
  res.render("listings/show.ejs", { listing });
};
```

---

### **4. Routes** (`routes/` folder)
**Purpose:** Maps URLs to controller functions and applies middleware.

**Contains:**
- URL route definitions
- HTTP method mappings (GET, POST, PUT, DELETE)
- Middleware application (authentication, validation, file upload)
- Route grouping and organization

**Files:**
```
routes/
├── listing.js              # Listing routes (/Listings, /Listings/:id)
├── review.js               # Review routes (/listings/:id/reviews)
├── user.js                 # User routes (/signup, /login, /logout)
└── cloudConFig.js          # Cloudinary & Multer configuration (not a route file)
```

**Example:**
```javascript
// routes/listing.js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.js");
const { islogin, isOwner, validateListing } = require("../middleware.js");

// Route chaining
router.route("/")
  .get(listingController.index)                           // Show all listings
  .post(islogin, upload.single('image'), 
        validateListing, listingController.createListing); // Create listing

router.route("/:id")
  .get(listingController.showListing)                     // Show single listing
  .put(islogin, isOwner, upload.single('image'),
       validateListing, listingController.updateListing)  // Update listing
  .delete(islogin, isOwner, listingController.destroyListing); // Delete listing
```

---

## 🔄 Request Flow (MVC in Action)

### **Example: Viewing a Property Listing**

```
1. USER ACTION
   └─→ User clicks on property listing
   
2. ROUTE (routes/listing.js)
   └─→ GET /listings/:id
   └─→ Maps to listingController.showListing
   
3. CONTROLLER (controllers/listing.js)
   └─→ showListing function executes
   └─→ Fetches data from Model
   
4. MODEL (models/listing.js)
   └─→ Queries MongoDB using Mongoose
   └─→ Returns listing data with populated reviews & owner
   
5. CONTROLLER (continued)
   └─→ Receives data from Model
   └─→ Passes data to View
   
6. VIEW (views/listings/show.ejs)
   └─→ Renders HTML with dynamic data
   └─→ Displays property details, map, reviews
   
7. RESPONSE
   └─→ Browser receives and displays HTML page
```

### **Example: Creating a New Property Listing**

```
1. USER ACTION
   └─→ User submits "Create Listing" form with image
   
2. ROUTE (routes/listing.js)
   └─→ POST /Listings
   └─→ Applies middleware: islogin, upload.single('image'), validateListing
   └─→ Maps to listingController.createListing
   
3. MIDDLEWARE (middleware.js)
   └─→ islogin: Checks if user is authenticated
   └─→ upload.single('image'): Uploads image to Cloudinary via Multer
   └─→ validateListing: Validates form data using Joi schema
   
4. CONTROLLER (controllers/listing.js)
   └─→ createListing function executes
   └─→ Uses Mapbox API to geocode location (get coordinates)
   └─→ Creates new listing object
   └─→ Saves to database via Model
   
5. MODEL (models/listing.js)
   └─→ Mongoose saves document to MongoDB
   └─→ Returns saved listing with generated _id
   
6. CONTROLLER (continued)
   └─→ Sets flash message "New listing added successfully!"
   └─→ Redirects to /listings (all listings page)
   
7. RESPONSE
   └─→ Browser redirects to listings page
   └─→ Flash message displays at top
```

---

## 🛡️ Additional Components

### **Middleware** (`middleware.js`)
**Purpose:** Functions that execute between route and controller.

**Contains:**
- Authentication checks (`islogin`)
- Authorization checks (`isOwner`, `isReviewAuthor`)
- Data validation (`validateListing`, `validateReview`)
- Session management (`saveRedtecturl`)

**Example:**
```javascript
module.exports.islogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};
```

---

### **Schema Validation** (`schema.js`)
**Purpose:** Defines Joi validation schemas for data integrity.

**Contains:**
- Listing validation schema
- Review validation schema
- Field-level validation rules

---

### **Utilities** (`utils/` folder)
**Purpose:** Reusable helper functions and custom classes.

**Contains:**
```
utils/
├── ExpressError.js         # Custom error class with status codes
└── wrapAsync.js            # Async error handling wrapper
```

---

### **Public Assets** (`public/` folder)
**Purpose:** Static files served directly to the browser.

**Contains:**
```
public/
├── css/                    # Stylesheets
│   ├── style.css           # Main styles
│   └── chatbot.css         # Chatbot styles
│
├── js/                     # Client-side JavaScript
│   ├── map.js              # Mapbox map rendering
│   ├── chatbot-gemini.js   # AI chatbot functionality
│   └── script.js           # Listing card interactions
│
└── images/                 # Static images
```

---

### **Configuration** (`app.js`)
**Purpose:** Main application entry point that ties everything together.

**Responsibilities:**
- Express app initialization
- Database connection (MongoDB via Mongoose)
- Middleware configuration (sessions, flash, passport)
- View engine setup (EJS with ejs-mate)
- Route mounting
- Error handling
- Server startup

---

## 📋 MVC Benefits in NxtStay

✅ **Separation of Concerns:** Each component has a clear, single responsibility  
✅ **Maintainability:** Easy to locate and modify specific functionality  
✅ **Scalability:** Can add new features without affecting existing code  
✅ **Testability:** Components can be tested independently  
✅ **Team Collaboration:** Multiple developers can work on different layers simultaneously  
✅ **Code Reusability:** Views use layouts/partials, controllers share middleware  

---

## 🎯 Quick Reference

| Component | Location | Responsibility | Example |
|-----------|----------|----------------|---------|
| **Model** | `models/` | Data & Database | `Listing.findById(id)` |
| **View** | `views/` | UI & Templates | `show.ejs` renders HTML |
| **Controller** | `controllers/` | Business Logic | `createListing()` processes form |
| **Route** | `routes/` | URL Mapping | `GET /listings/:id` → controller |
| **Middleware** | `middleware.js` | Request Processing | `islogin` checks authentication |

---

**Last Updated:** December 9, 2025  
**Project:** NxtStay - Vacation Rental Platform  
**Architecture:** MVC (Model-View-Controller)
