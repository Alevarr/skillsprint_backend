const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/Rental");
const { Customer } = require("../models/Customer");
const { Movie } = require("../models/Movie");

router.use(express.json());

router.get("/", async (req, res) => {
  res.send(await Rental.find());
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const rentalById = await Rental.findById(id);
  if (!rentalById) return res.status(404).send("Movie not found");
  res.send(rentalById);
});

router.post("/", async (req, res) => {
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);

  const customerId = req.body.customerId;
  if (!mongoose.isValidObjectId(customerId))
    return res.status(400).send("Bad request");
  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(404).send("Customer not found");
  const moviesArr = [];
  for (let i = 0; i < req.body.moviesIds.length; i++) {
    const movieId = req.body.moviesIds[i];
    if (!mongoose.isValidObjectId(movieId))
      return res.status(400).send("Bad request");
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).send("Movie not found");
    moviesArr.push({
      _id: movie._id,
      title: movie.title,
      genre: movie.genre,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    });
  }

  const rentalObject = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
    },
    movies: moviesArr,
  });
  rentalObject
    .save()
    .then((result) => res.send(result))
    .catch((e) => res.status(400).send("Bad request:"));
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);

  const customerId = req.body.customerId;
  if (!mongoose.isValidObjectId(customerId))
    return res.status(400).send("Bad request");
  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(404).send("Customer not found");

  const moviesArr = [];
  for (movieId in req.body.moviesIds) {
    if (!mongoose.isValidObjectId(movieId))
      return res.status(400).send("Bad request");
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).send("Movie not found");
    moviesArr.push({
      _id: movie._id,
      title: movie.title,
      genre: movie.genre,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    });
  }

  Rental.findByIdAndUpdate(
    id,
    {
      $set: {
        customer: {
          _id: customer._id,
          name: customer.name,
        },
        movies: moviesArr,
      },
    },
    { new: true, runValidators: true }
  )
    .then((result) =>
      result ? res.send(result) : res.status(404).send("Rental not found")
    )
    .catch((e) => {
      res.status(400).send(e.message);
    });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const deletedRental = await Rental.findByIdAndRemove(id);
  if (!deletedRental) return res.status(404).send("Rental not found");
  res.send(deletedRental);
});

module.exports = router;
