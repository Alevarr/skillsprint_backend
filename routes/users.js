const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/User");

router.use(express.json());

router.post("/", async (req, res) => {
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);

  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);
  const userObject = new User({
    name: req.body.name,
    email: req.body.email,
    password: password,
  });
  userObject
    .save()
    .then((result) =>
      res
        .header("x-auth-token", result.generateAuthToken())
        .send(_.pick(result, ["name", "email"]))
    )
    .catch((e) => res.status(400).send("Bad request"));
});

module.exports = router;
