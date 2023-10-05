const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Genre } = require("../models/Genre");
const { Movie, validate } = require("../models/Movie");

router.use(express.json());

router.get("/", async (req, res) => {
  res.send(await Movie.find());
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const customerById = await Movie.findById(id);
  if (!customerById) return res.status(404).send("Movie not found");
  res.send(customerById);
});

router.post("/", async (req, res) => {
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);

  const genreId = req.body.genreId;
  if (!mongoose.isValidObjectId(genreId))
    return res.status(400).send("Bad request");

  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(404).send("Genre not found");
  const movieObject = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movieObject
    .save()
    .then((result) => res.send(result))
    .catch((e) => res.status(400).send("Bad request"));
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);

  const genreId = req.body.genreId;
  if (!mongoose.isValidObjectId(genreId))
    return res.status(400).send("Bad request");

  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(404).send("Genre not found");

  Movie.findByIdAndUpdate(
    id,
    {
      $set: {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
    },
    { new: true, runValidators: true }
  )
    .then((result) =>
      result ? res.send(result) : res.status(404).send("Movie not found")
    )
    .catch((e) => {
      res.status(400).send(e.message);
    });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const deletedMovie = await Movie.findByIdAndRemove(id);
  if (!deletedMovie) return res.status(404).send("Movie not found");
  res.send(deletedMovie);
});

module.exports = router;
