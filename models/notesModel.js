const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const moment = require("moment");

const Note = mongoose.model(
  "Notes",
  new mongoose.Schema(
    {
      title: {
        type: String,
        trim: true
      },
      content: {
        type: Object,
        required: true
      },
      tags: {
        type: Array,
        required: true
      },
      col: {
        type: Object,
        required: true
      },
      user: {
        type: String
      },
      updated: {
        type: String,
        default: moment().format()
      }
    },
    { minimize: false }
  )
);

function validateNote(note) {
  const schema = {
    _id: Joi.string(),
    title: Joi.string().allow(""),
    content: Joi.object().required(),
    tags: Joi.array().required(),
    collection: Joi.object().required(),
    user: Joi.string().email(),
    updated: Joi.string()
  };

  return Joi.validate(note, schema);
}

exports.Note = Note;
exports.validateNote = validateNote;
