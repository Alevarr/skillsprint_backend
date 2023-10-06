const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Case, validate } = require("../models/Case");
const { User } = require("../models/User");
const { Category } = require("../models/Category");
const _ = require("lodash")
router.use(express.json());

router.post("/", auth, async (req, res) => {
  const { error: validationError } = validate(req.body);
  if (validationError)
  return res
    .status(400)
    .send("Bad request: " + validationError.details[0].message);
    
  const customerId = req.body.customerId;
  if (!mongoose.isValidObjectId(customerId)) return res.status(400).send("Bad request");
  const customer = await User.findById(customerId);
  if (!customer) return res.status(404).send("Customer not found");

  const categoryId = req.body.categoryId;
  if (!mongoose.isValidObjectId(categoryId)) return res.status(400).send("Bad request");
  const category = await Category.findById(categoryId);
  if (!category) return res.status(404).send("Category not found");
    const caseObject = new Case({
        customer: customer._id,
        title: req.body.title,
        description: req.body.description,
        budget: 0,
        category: {
            _id: category._id,
            name: category.name,
        },
        deadline: req.body.deadline,
        status: "placed",
        freelancer: null
    });
caseObject.save().then(result => {
    result.customer = _.pick(result.customer, ["_id", "name", "email", "role"])
    res.send(result)
}).catch(e => res.status(400).send(e.message))
})

module.exports = router;