const Joi = require("joi");

const validateAuth = (auth) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(auth);
};

module.exports = validateAuth;
