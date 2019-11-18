const moment = require("moment");
const { Note, validateNote } = require("../models/notesModel");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.use(function timeLog(req, res, next) {
  console.log("Notes API accessed: ", new Date().toLocaleString());
  next();
});

router.get("/", auth, async (req, res) => {
  // find all notes by user
  try {
    var notes = await Note.find({ user: req.user.email })
      .select("-__v")
      .sort("-updated");
  } catch (ex) {
    return res.status(404).send("No notes found for this user.");
  }
  return res.send(notes);
});

router.post("/", auth, async (req, res) => {
  // request formatted correctly?
  const { error } = validateNote(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // create new note from mongoose model
  const newNote = new Note({
    title: req.body.title.trim(),
    content: req.body.content,
    tags: req.body.tags,
    col: req.body.collection,
    user: req.user.email.trim(),
    updated: moment().format()
  });
  await newNote.save(function saveNote(error, note) {
    if (error)
      return res
        .status(500)
        .send("an error occured when saving the note. please try again");

    console.log(`New Note created! ~~ ${note.title}`);
  });

  return res.send(newNote);
});

router.put("/:id", auth, async (req, res) => {
  // request formatted correctly?
  const { error } = validateNote(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // find note in database
  try {
    var note = await Note.findById(req.params.id);
  } catch (ex) {
    return res.status(404).send("Note not found. Please send a valid ID.");
  }

  // authorization
  if (note.user !== req.user.email)
    return res
      .status(403)
      .send("You do not have permission to edit this note.");

  note = await Note.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      col: req.body.collection,
      user: req.user.email,
      updated: moment().format()
    },
    { new: true },
    function updateNote(error, note) {
      if (error)
        return res
          .status(500)
          .send("internal server error updating note. please try again");

      console.log(`Note updated! ~~ ${note.title}`);
    }
  ).select("-__v");

  return res.send(note);
});

router.delete("/:id", auth, async (req, res) => {
  try {
    var note = await Note.findById(req.params.id);
  } catch (ex) {
    return res.status(400).send("Note not found. Please send a valid ID.");
  }

  // authorization
  if (req.user.email !== note.user)
    return res
      .status(403)
      .send("You do not have permission to delete this note.");

  note = await Note.findByIdAndRemove(req.params.id, function deleteNote(
    error,
    note
  ) {
    if (error)
      return res
        .status(500)
        .send("Something went wrong. Could not delete note.");

    console.log(`Note deleted! ~~ ${note.title}`);
  }).select("-__v");

  return res.send(note);
});

router.get("/:id", auth, async (req, res) => {
  // find note in database
  try {
    var note = await Note.findById(req.params.id).select("-__v");
  } catch (ex) {
    return res.status(404).send("Note with given ID was not found");
  }

  // authorization
  if (req.user.email !== note.user)
    return res
      .status(403)
      .send("You do not have permission to view this note.");

  return res.send(note);
});

module.exports = router;
