const { ref } = require("joi");
const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

// ===== REVIEW MODEL (RATING & COMMENT SCHEMA) =====
// Database schema for property reviews
const reviewSchema = new Schema({
    comment:String, // Review text
    rating:{ // Star rating
        type:Number,
        min:1, // 1 star minimum
        max:5, // 5 stars maximum
    },
    createdAt:{ // Auto-generated timestamp
        type:Date,
        default: Date.now
    },
    author:{ // User who wrote the review
        type: Schema.Types.ObjectId,
        ref:"User",
    }
});


module.exports = mongoose.model("Review",reviewSchema);