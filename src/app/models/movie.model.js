const mongoose = require("mongoose");

// Define the movie schema
const movieSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  URL: {
    type: String,
    required: true
  },
  Description: {
    type: String ,
    required: true
  }
});

// Define the movie model
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
