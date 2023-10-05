const Joi = require("joi")
const mongoose = require("mongoose"); 


const customerSchema = mongoose.Schema({
    name: {type: String, required: true},
    isGold: {type: Boolean, required: true, default: false},
    phone: {type: String, required: true}
})
const Customer = mongoose.model("Customer", customerSchema)

const validateCustomer = (customer) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        isGold: Joi.bool().required(),
        phone: Joi.string().required()
    })
    return schema.validate(customer);
}

exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomer;