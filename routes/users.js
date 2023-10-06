const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/User");
const auth = require("../middleware/auth");

router.use(express.json());

router.post("/", async (req, res) => {
  req.body = req.body.params;
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);

  const user = await User.findOne({
    email: req.body.email,
  });

  if (user) return res.status(400).send("User with such email already exists");

  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);
  const userObject = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: password,
    balance: 0
  });
  userObject
    .save()
    .then((result) =>
      res
        .send({"x-auth-token": result.generateAuthToken()})
    )
    .catch(() => res.status(400).send("Bad request"));
});

router.get("/me", auth, async (req, res) => {
  req.body = req.body.params;

  const user = await User.findOne({
    _id: req.user._id,
  });
  res.send(_.pick(user, ["name", "email", "role", "balance"]))
})

module.exports = router;
