const { response } = require("express");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken:mapToken}); // Mapbox client for geocoding

// ===== SHOW ALL LISTINGS (HOME PAGE) =====
// Supports search by text and filter by category
module.exports.index = 
    async (req, res) => {
        let allListings;
        // Filter by category (e.g., Trending, Mountains, Beaches)
        if (req.query.category && req.query.category.trim() !== "") {
            allListings = await Listing.find({
                "category": req.query.category.trim()
            });
        } 
        // Search by title, location, or country
        else if (req.query.search && req.query.search.trim() !== "") {
            const regex = new RegExp(req.query.search, 'i'); // Case-insensitive search
            allListings = await Listing.find({
                $or: [
                    { title: regex },
                    { location: regex },
                    { country: regex }
                ]
            });
        } 
        // Show all listings if no filter/search
        else {
            allListings = await Listing.find({});
        }
        res.render("listings/index.ejs", { allListings });
    }


// ===== CREATE NEW LISTING =====
// Creates new property listing with image upload and geocoding
module.exports.createListing = async (req, res, next) => {

 // Get coordinates from location using Mapbox Geocoding API
 let responce = await geocodingClient.forwardGeocode({
  query: req.body.Listing.location, // e.g., "Malibu, California"
  limit: 1
})
  .send()

  const newListing =new Listing(req.body.Listing);
  
  // Add uploaded image from Cloudinary
  if (req.file) {
    newListing.image = {
      url: req.file.path,        // Cloudinary URL
      filename: req.file.filename // Cloudinary file ID
    };
  }
  
  newListing.owner = req.user._id; // Set current user as owner
  newListing.geometry = responce.body.features[0].geometry; // Add coordinates for map
  let savedListing=await newListing.save();
  console.log(savedListing);
  req.flash("success", "New listing added successfully!");
  res.redirect("/listings");
};


// ===== SHOW SINGLE LISTING =====
// Displays property details with reviews, owner info, and map
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  // Populate reviews with author info and owner details
  const listing = await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{
      path:"author" // Get review author's username
    }
  })
  .populate("owner"); // Get listing owner's username
  
  if (!listing) {
    req.flash("error", "The listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }

  // Render with Mapbox token for displaying location map
  res.render("listings/show.ejs", { listing, mapToken: process.env.MAP_TOKEN });
}

// ===== RENDER EDIT FORM =====
// Shows form to edit existing listing
module.exports.editListing = async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "listing is Edited successfully!");
  if (!listing) {
    req.flash("error", "The listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }

  // Create thumbnail version of image (width 250px)
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs",{listing,originalUrl});
}

// ===== UPDATE LISTING =====
// Updates existing listing with new data and optional new image
module.exports.updateListing = async (req, res) => {
   const { id } = req.params;

  if (!req.body.Listing) {
    throw new ExpressError(400, "Invalid listing data");
  }

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });

  // Update image if new one is uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "listing is updated successfully!");
  res.redirect(`/listings/${id}`);
}

// ===== DELETE LISTING =====
// Deletes listing and all associated reviews (cascade delete)
module.exports.destroyListing = async(req,res)=>{
  const { id } = req.params;
  let deleatedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleated successfully!");
  res.redirect(`/listings`);
}