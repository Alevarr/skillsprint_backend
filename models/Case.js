const Joi = require("joi");
const mongoose = require("mongoose");
const {categorySchema} = require("./Category")

const caseSchema = mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    freelancer: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    title: {type: String, required: true},
    description: {type: String, required: true},
    budget: {type: Number, min: 0, required: true, default: 0},
    category: {type: String, required: true},
    deadline: {type: Date},
    status: {type: String, required: true},
    comment_on_completion: {type: String}
})

const Case = mongoose.model("Case", caseSchema)

const validateCase = (order) => {
    const schema = Joi.object({
        freelancerId: Joi.string(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        budget: Joi.number().min(0),
        category: Joi.string().required(),
        deadline: Joi.date().timestamp("unix"),
        comment_on_completion: Joi.string()


    })
    return schema.validate(order);
}

exports.caseSchema = caseSchema;
exports.Case = Case;
exports.validate = validateCase;