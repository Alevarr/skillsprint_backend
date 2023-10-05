const Joi = require("joi")
const mongoose = require("mongoose"); 
const genreSchema = mongoose.Schema({
    name: {type: String, required: true}
})
const Genre = mongoose.model("Genre", genreSchema)

const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().required()
    })
    return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;