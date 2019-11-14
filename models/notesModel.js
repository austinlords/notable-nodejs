const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const Note = mongoose.model(
  "Notes",
  new mongoose.Schema({
    title: {
      type: String,
      maxlength: 255,
      required: true,
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
    updated: String
  })
);

function validateNote(note) {
  const schema = {
    _id: Joi.string(),
    title: Joi.string()
      .max(255)
      .required(),
    content: Joi.object().required(),
    tags: Joi.array().required(),
    collection: Joi.object().required(),
    user: Joi.string()
      .email()
      .required(),
    updated: Joi.string()
  };

  return Joi.validate(note, schema);
}

exports.Note = Note;
exports.validateNote = validateNote;