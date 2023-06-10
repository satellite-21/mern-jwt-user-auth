const express = require("express");
const router = express.Router();
const Movie = require("../models/movie.model");

// Fetch all movies or results based on query parameter 
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let movies;

    if(search) {
      movies = await Movie.find({
        $or: [
          {Title: { $regex: search, $options: 'i'}},
          { Description: { $regex: search, $options: 'i' } }
        ]
      });
    } else {
   //this will generate random samples of movies in the fetchovies
      movies = await Movie.aggregate([{ $sample: { size: 12 } }]);

    }

    res.json(movies);

    // const movies = await Movie.find();
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

module.exports = router;
