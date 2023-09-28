const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = { User };
