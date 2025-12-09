const Listing = require("./models/listing.js");
const {ListingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

// ===== AUTHENTICATION MIDDLEWARE =====
// Checks if user is logged in before allowing access
module.exports.islogin = (req,res,next)=>{
     if(!req.isAuthenticated()){ // Passport method to check login status
      req.session.redirectUrl = req.originalUrl; // Save URL to redirect after login
    req.flash("error", "User must Login before add new listing!");
    return res.redirect("/login");
  }
  next();
}

// Saves redirect URL for after login
module.exports.saveRedtecturl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

// ===== AUTHORIZATION MIDDLEWARE =====
// Checks if current user is the owner of the listing
module.exports.isOwner = async(req,res,next)=>{
  const { id } = req.params;
  let list = await Listing.findById(id);
  if(! res.locals.Curruser._id.equals(list.owner._id)){ // Compare owner ID with current user ID
    req.flash("error","You are not ower of this Listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}


// ===== VALIDATION MIDDLEWARE =====
// Validates listing data using Joi schema before saving
module.exports.validateListing = (req, res, next) => {
  let {error } = ListingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Validates review data using Joi schema before saving
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Checks if current user is the author of the review
module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(! review.author.equals(res.locals.Curruser._id)){
    req.flash("error","You are not Author of this Listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
