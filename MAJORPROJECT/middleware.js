const Listing = require("./models/listing.js");
const {ListingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.islogin = (req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
    req.flash("error", "User must Login before add new listing!");
    return res.redirect("/login");
  }
  next();
}


module.exports.saveRedtecturl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req,res,next)=>{
  const { id } = req.params;
  let list = await Listing.findById(id);
  if(! res.locals.Curruser._id.equals(list.owner._id)){
    req.flash("error","You are not ower of this Listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}


//validateListing
module.exports.validateListing = (req, res, next) => {
  let {error } = ListingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


//validateReview 
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(! review.author.equals(res.locals.Curruser._id)){
    req.flash("error","You are not Author of this Listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
