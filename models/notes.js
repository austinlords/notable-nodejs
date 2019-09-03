const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const Note = mongoose.model(
  "Notes",
  new mongoose.Schema({
    title: {
      type: String,
      maxlength: 50,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    preview: {
      type: String,
      trim: true,
      maxlength: 255
    },
    updated: {
      type: String,
      required: true
    },
    user: {
      type: String
    }
  })
);

function validateNote(note) {
  const schema = {
    title: Joi.string()
      .max(50)
      .required(),
    content: Joi.string().required(),
    preview: Joi.string().max(255),
    updated: Joi.string().required(),
    user: Joi.string()
  };

  return Joi.validate(note, schema);
}

exports.Note = Note;
exports.validateNote = validateNote;
