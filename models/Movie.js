const Joi = require("joi")
const mongoose = require("mongoose"); 
const {genreSchema} = require("./Genre")

const movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    genre: genreSchema,
    numberInStock: {type: Number, min: 0, required: true, default: 0},
    dailyRentalRate: {type: Number, min: 0, required: true, default: 0}
})
const Movie = mongoose.model("Movie", movieSchema)

const validateMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    })
    return schema.validate(movie);
}

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validate = validateMovie;