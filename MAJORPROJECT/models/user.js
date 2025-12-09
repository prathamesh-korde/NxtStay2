const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// ===== USER MODEL (AUTHENTICATION SCHEMA) =====
// Database schema for user accounts
const userSchema = new Schema({
    email: {
        type: String,
        required: true,   
    }
    // username, hash, salt fields added automatically by passportLocalMongoose
});

// Add authentication functionality (username, password hashing, login methods)
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

