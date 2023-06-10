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
   const page =  parseInt(req.query.page) || 1;
   const batchSize = 12;
   const skipCount = (page-1)*batchSize;

   movies = await Movie.aggregate([
    { $match: { _id: { $nin: req.query.excludedMovies || [] }}},
    { $sample: { size: batchSize}},
    { $skip: skipCount }
   ]);

   const movieIds = movies.map(movie => movie._id);
   const remainingMovies = await Movie.find({
    _id: { $nin: movieIds }
   }).limit(batchSize);

   movies = movies.concat(remainingMovies);

    }

    res.json(movies);

    // In the backend code, we introduced pagination logic similar to before, 
    // but now we exclude the already fetched movies using the excludedMovies query parameter.
    //  We fetch a batch of random movies, skip the appropriate number of movies based on the page, 
    //  and then fetch the remaining movies in a separate query. Finally, we combine the two sets of movies and return the response.
  
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
