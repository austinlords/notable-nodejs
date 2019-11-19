const moment = require("moment");
const { Note, validateNote } = require("../models/notesModel");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    var notes = await Note.find({ user: req.user.email })
      .select("-__v")
      .sort("-updated");
    return res.send(notes);
  } catch (ex) {
    return res.status(404).send("No notes found for this user.");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateNote(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newNote = new Note({
    title: req.body.title.trim(),
    content: req.body.content,
    tags: req.body.tags,
    col: req.body.collection,
    user: req.user.email.trim(),
    updated: moment().format()
  });
  await newNote.save(function saveNote(error, note) {
    if (error) return res.status(500).send("Error. please try again");

    return res.send(note);
  });
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateNote(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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

  await Note.findByIdAndUpdate(
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
      if (error) return res.status(500).send("Error. Please try again");

      return res.send(note);
    }
  );
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

  await Note.findByIdAndRemove(req.params.id, function deleteNote(error, note) {
    if (error) return res.status(500).send("Error. Could not delete note.");

    return res.send(note);
  });
});

router.get("/:id", auth, async (req, res) => {
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
