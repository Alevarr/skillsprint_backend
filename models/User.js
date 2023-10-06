const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, name: this.name, role: this.role }, config.get("jwtPrivateKey"));
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    password: Joi.string().required(),
    balance: Joi.number().min(0)
  });
  return schema.validate(user);
};

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
