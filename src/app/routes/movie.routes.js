const express = require("express");
const router = express.Router();
const Movie = require("../models/movie.model");

// Fetch all movies or results based on query parameter 
router.get("/", async (req, res) => {
  try {
    const { search, excludedMovies = '[]' } = req.query;
    let excludedMovieIds;

    try {
      excludedMovieIds = JSON.parse(excludedMovies);
      // console.log(excludedMovieIds);
    } catch (error) {
      console.error("Error parsing excludedMovies JSON:", error);
      excludedMovieIds = [];
    }

    let movies;

    if (search) {
      movies = await Movie.find({
        $or: [
          { Title: { $regex: search, $options: "i" } },
          { Description: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      const page = parseInt(req.query.page) || 1;
      const batchSize = 12;
      const skipCount = (page - 1) * batchSize;

      movies = await Movie.aggregate([
        { $match: { _id: { $nin: excludedMovieIds } } },
        { $sample: { size: batchSize } },
        { $skip: skipCount },
      ]);

      const movieIds = movies.map((movie) => movie._id);
      const remainingMovies = await Movie.find({
        _id: { $nin: movieIds },
      }).limit(batchSize);

      movies = movies.concat(remainingMovies);
    }

    res.json(movies);
  } catch (error) {
    console.log("Error fetching movies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


  // utilising the DELETE functionality
  router.delete("/:id", async (req, res ) => {
    try{
      const { id } = req.params;
      await Movie.findByIdAndDelete(id);
      res.json({message: "Movie Deleted Successfully!"});
    } catch(error){
      console.log("Error deleting movie:", error);
      res.status(500).json({message: "Internal Server Error"});
    }
  });
  // Add a new movie
router.post("/", async (req, res) => {
  try {
    const { Title, URL, Description } = req.body;
    const newMovie = await Movie.create({
      Title,
      URL,
      Description,
    });
    res.json(newMovie);
  } catch (error) {
    console.log("Error adding movie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    console.log("Received PUT request for movie ID:", id);
    console.log("Field:", field);
    console.log("Value:", value);

    // Find the movie by ID
    const movie = await Movie.findById(id);

    if (!movie) {
      console.log("Error!! Movie not found!");
      return res.status(404).json({ message: "Movie not found!" });
    }

    switch (field) {
      case "Title":
        console.log("Updating Title:", value);
        movie.Title = value;
        break;
      case "URL":
        console.log("Updating URL:", value);
        movie.URL = value;
        break;
      case "Description":
        console.log("Updating Description:", value);
        movie.Description = value;
        break;
      default:
        console.log("Invalid Field!");
        return res.status(400).json({ message: "Invalid Field!" });
    }

    await movie.save();
    console.log("Movie Updated Successfully");
    res.json({ message: "Movie Updated Successfully" });
  } catch (error) {
    console.log("Internal server Error:", error);
    res.status(500).json({ message: "Internal server Error" });
  }
});

module.exports = router;
