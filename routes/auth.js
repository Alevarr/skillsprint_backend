const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const validate = require("../models/Auth");
const { User } = require("../models/User");

router.use(express.json());

router.post("/", async (req, res) => {
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);

  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) res.status(400).send("Invalid email or password");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) res.status(400).send("Invalid email or password");
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
