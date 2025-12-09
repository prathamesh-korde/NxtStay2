const Joi = require('joi');

// ===== JOI VALIDATION SCHEMAS =====
// Server-side validation for listings and reviews

// Listing validation - ensures all required fields are present and valid
module.exports.ListingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(), // Price must be 0 or greater
    category: Joi.string().valid('Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pools', 'Camping', 'Farms', 'Artic', 'Boats').required(),
  }).required()
});

// Review validation - ensures rating is 1-5 and comment exists
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(), // 1-5 stars
    comment: Joi.string().required()
  }).required()
});

