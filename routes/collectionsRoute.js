const express = require("express");
const router = express.Router();
const {
  Collection,
  validateCollection
} = require("../models/collectionsModel");
const moment = require("moment");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  // find all collections by user
  try {
    var collections = await Collection.find({ user: req.user.email })
      .select("-__v")
      .sort("name");
  } catch (ex) {
    return res.status(404).send("No collections found for this user");
  }

  return res.send(collections);
});

router.post("/", auth, async (req, res) => {
  // req formatted correctly?
  const { error } = validateCollection(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // auth-token matches user/email in request?
  if (req.user.email !== req.body.user)
    return res
      .status(400)
      .send(
        "Auth token does not match user/email in request. Please try again."
      );

  try {
    // normalize data
    var reqName = req.body.name.toLowerCase().trim();

    var collection = await Collection.find({
      user: req.user.email,
      name: reqName
    });

    if (collection.length)
      return res
        .status(400)
        .send(
          "Collection with this name already exists! Cannot create collection"
        );
  } catch (ex) {
    return res.status(500).send("Internal server error, please try again.");
  }

  collection = new Collection({
    name: reqName,
    color: req.body.color,
    user: req.user.email
  });

  collection = await collection.save();

  res.send(collection);
});

router.put("/:id", auth, async (req, res) => {
  // req formatted correctly?
  const { error } = validateCollection(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // auth-token matches user/email in request?
  if (req.user.email !== req.body.user)
    return res
      .status(400)
      .send(
        "Auth token does not match user/email in request. Please try again."
      );

  // normalize data
  var reqName = req.body.name.toLowerCase().trim();

  try {
    var collection = await Collection.findById(req.params.id);
  } catch (ex) {
    return res.status(404).send("Collection with provided ID does not exist.");
  }

  collection = await Collection.findByIdAndUpdate(
    req.params.id,
    {
      name: reqName,
      color: req.body.color,
      user: req.user.email,
      updated: moment().format()
    },
    { new: true },
    function updatedCollection(error, collection) {
      if (error) return res.status(500).send("could not update collection");

      console.log(`Collection updated ~~ ${collection.name}`);
    }
  );

  return res.send(collection);
});

module.exports = router;
