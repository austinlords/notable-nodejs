const express = require("express");
const router = express.Router();
const {
  Collection,
  validateCollection
} = require("../models/collectionsModel");
const moment = require("moment");
const auth = require("../middleware/auth");
const { asyncWrap } = require("../middleware/errorHandling");

router.get(
  "/",
  auth,
  asyncWrap(async (req, res) => {
    var collections = await Collection.find({ user: req.user.email })
      .select("-__v")
      .sort("name");

    return res.json(collections);
  })
);

router.post(
  "/",
  auth,
  asyncWrap(async (req, res) => {
    const { error } = validateCollection(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const reqName = req.body.name.toLowerCase().trim();

    let collection = await Collection.find({
      user: req.user.email,
      name: reqName
    });
    if (collection.length) {
      res.status(400);
      throw new Error("Collection with this name already exists!");
    }

    let newCollection = await new Collection({
      name: reqName,
      color: req.body.color,
      user: req.user.email
    }).save();

    return res.json(newCollection);
  })
);

router.put(
  "/:id",
  auth,
  asyncWrap(async (req, res) => {
    const { error } = validateCollection(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const reqName = req.body.name.toLowerCase().trim();

    let collection = await Collection.findById(req.params.id);

    if (!collection) {
      res.status(404);
      throw new Error("Collection with provided ID does not exist.");
    }

    collection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        name: reqName,
        color: req.body.color || collection.color,
        user: req.user.email,
        updated: moment().format()
      },
      { new: true }
    );

    return res.json(collection);
  })
);

router.delete(
  "/:id",
  auth,
  asyncWrap(async (req, res) => {
    let collection = await Collection.findById(req.params.id);

    if (!collection) {
      res.status(404);
      throw new Error("Collection with provided ID does not exist.");
    }

    if (collection.user !== req.user.email) {
      res.status(403);
      throw new Error("You cannot delete this note");
    }

    collection = await Collection.findByIdAndRemove(req.params.id);

    return res.json(collection);
  })
);

module.exports = router;
