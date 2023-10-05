const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/Customer");

router.use(express.json());

router.get("/", async (req, res) => {
  res.send(await Customer.find());
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const customerById = await Customer.findById(id);
  if (!customerById) return res.status(404).send("Customer not found");
  res.send(customerById);
});

router.post("/", (req, res) => {
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);
  const customerObject = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customerObject
    .save()
    .then((result) => res.send(result))
    .catch((e) => res.status(400).send("Bad request"));
});

router.put("/:id", (req, res) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const { error: validationError } = validate(req.body);
  if (validationError)
    return res
      .status(400)
      .send("Bad request: " + validationError.details[0].message);

  Customer.findByIdAndUpdate(
    id,
    {
      $set: { ...req.body },
    },
    { new: true, runValidators: true }
  )
    .then((result) =>
      result ? res.send(result) : res.status(404).send("Customer not found")
    )
    .catch((e) => {
      res.status(400).send(e.message);
    });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("Bad request");
  const deletedCustomer = await Customer.findByIdAndRemove(id);
  if (!deletedCustomer) return res.status(404).send("Customer not found");
  res.send(deletedCustomer);
});

module.exports = router;
