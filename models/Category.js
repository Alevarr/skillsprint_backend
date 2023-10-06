const Joi = require("joi")
const mongoose = require("mongoose"); 

const categorySchema = mongoose.Schema({
    name: {type: String, required: true, unique: true}
    
})

const Category = mongoose.model("Category", categorySchema)

const validateCategory = (category) => {
    const schema = Joi.object({
        name: Joi.string().required()
    })
    return schema.validate(category);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;