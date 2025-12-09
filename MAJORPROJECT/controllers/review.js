const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// ===== CREATE REVIEW =====
// Adds new review to a listing with author information
module.exports.createReview = async (req, res) => {

  if (!req.body.review) {
    throw new ExpressError(400, "Invalid review data");
  }

  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);


  newReview.author = req.user._id; // Set current user as review author
  

  listing.reviews.push(newReview); // Add review to listing's review array

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review added successfully!");

  res.redirect(`/listings/${listing._id}`);
}

// ===== DELETE REVIEW =====
// Removes review from listing and deletes it from database
module.exports.destroyReview = async(req,res)=>{
  let {id,reviewId} = req.params;

  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); // Remove review ID from listing
  await Review.findByIdAndDelete(reviewId); // Delete the review

  req.flash("success", "Review deleated successfully!");

  res.redirect(`/listings/${id}`)
}