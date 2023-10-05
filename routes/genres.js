const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/Genre");

router.use(express.json());

router.get("/", async (req, res) => {
  res.send(await Genre.find());
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const genreById = await Genre.findById(id);
  if (!genreById) return res.status(404).send("Genre not found");
  res.send(genreById);
});

router.post("/", auth, (req, res) => {
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);
  const genreObject = new Genre({
    name: req.body.name,
  });

  genreObject
    .save()
    .then((result) => res.send(result))
    .catch((e) => res.status(400).send("Bad request"));
});

router.put("/:id", (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);

  Genre.findByIdAndUpdate(
    id,
    {
      $set: {
        name: req.body.name,
      },
    },
    { new: true, runValidators: true }
  )
    .then((result) =>
      result ? res.send(result) : res.status(404).send("Genre not found")
    )
    .catch((e) => {
      res.status(400).send(e.message);
    });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const deletedGenre = await Genre.findByIdAndRemove(id);
  if (!deletedGenre) return res.status(404).send("Genre not found");
  res.send(deletedGenre);
});

module.exports = router;
