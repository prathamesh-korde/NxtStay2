const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_URL = "mongodb://127.0.0.1:27017/NxtStay";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_URL);
}



const CATEGORY_ENUM = [
  'Trending',
  'Rooms',
  'Mountains',
  'Castles',
  'Amazing Pools',
  'Camping',
  'Farms',
  'Artic',
  'Boats'
];
const DEFAULT_CATEGORY = "Trending";
const DEFAULT_GEOMETRY = { type: "Point", coordinates: [0, 0] };

const initDB = async () =>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => {
   
    if (!obj.geometry) {
      obj.geometry = { ...DEFAULT_GEOMETRY };
    }
    if (!obj.category || !CATEGORY_ENUM.includes(obj.category)) {
      obj.category = CATEGORY_ENUM[Math.floor(Math.random() * CATEGORY_ENUM.length)];
    }
    return { ...obj, owner: "6884d358c4438591b0b43a0d" };
  });
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}

initDB();