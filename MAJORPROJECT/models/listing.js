const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref, string } = require("joi");

// ===== LISTING MODEL (PROPERTY SCHEMA) =====
// Database schema for vacation rental properties
const ListingSchema = new Schema({
  title:{
    type : String,
    
  },
  description : String,
  image: { // Cloudinary image
    url:String, // Image URL
    filename: String // Cloudinary file ID
   }
,
  price : Number,
  location : String,
  country : String,
   category: { // For filtering (Trending, Mountains, Beaches, etc.)
      type: String,
      enum: ['Trending','Rooms','Mountains','Castles','Amazing Pools','Camping','Farms','Artic','Boats'],  
    },
  reviews:[{ // Array of review IDs
    type:Schema.Types.ObjectId,
    ref:"Review",
  }],
  owner:{ // User who created the listing
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  geometry:{ // GeoJSON format for map coordinates
    type: {
      type: String, 
      enum: ['Point'], // GeoJSON Point type
      required: true
    },
    coordinates: { // [longitude, latitude]
      type: [Number],
      required: true
    }
  },
});

// ===== CASCADE DELETE REVIEWS =====
// When a listing is deleted, also delete all its reviews
ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;