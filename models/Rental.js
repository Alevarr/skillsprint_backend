const Joi = require("joi")
const mongoose = require("mongoose"); 
const {customerSchema} = require("./Customer")
const {movieSchema} = require("./Movie")

const rentalSchema = mongoose.Schema({
    customer: customerSchema,
    movies: [movieSchema]
})
const Rental = mongoose.model("Rental", rentalSchema)

const validateRental = (rental) => {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        moviesIds: Joi.array().items(Joi.string()).required()
    })
    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;