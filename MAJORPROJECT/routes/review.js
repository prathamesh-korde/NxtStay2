const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,islogin,isReviewAuthor} = require("../middleware.js");
const reviewControl = require("../controllers/review.js");

//post route - adding reviews
router.post("/",islogin,validateReview, wrapAsync(reviewControl.createReview));

//Delete reviews Route
router.delete("/:reviewId",islogin,isReviewAuthor, wrapAsync(reviewControl.destroyReview))

module.exports = router;


