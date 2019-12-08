const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const moment = require("moment");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true,
      default: "lightgray"
    },
    updated: {
      type: String,
      default: moment().format()
    },
    user: {
      type: String,
      required: true
    }
  },
  { minimize: false }
);

const Collection = mongoose.model("Collection", collectionSchema);

function validateCollection(collection) {
  const schema = {
    name: Joi.string().required(),
    color: Joi.string(),
    user: Joi.string()
      .email()
      .required()
  };

  return Joi.validate(collection, schema);
}

module.exports = {
  Collection,
  validateCollection
};
