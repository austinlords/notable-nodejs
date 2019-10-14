const moment = require("moment");
const { Note, validateNote } = require("../models/notesModel");
const express = require("express");
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log("Notes API accessed: ", new Date().toLocaleString());
  next();
});

router.get("/", async (req, res) => {
  const notes = await Note.find()
    .select("-__v")
    .sort("-updated");

  res.send(notes);
});

router.post("/", async (req, res) => {
  const { error } = validateNote(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags,
    col: req.body.collection,
    user: req.body.user,
    updated: moment().toJSON()
  });
  await newNote.save();
  console.log(`Note created! ~~ ${newNote.title}`);

  return res.send(newNote);
});

router.put("/:id", async (req, res) => {
  const { error } = validateNote(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const note = await Note.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      col: req.body.collection,
      user: req.body.user,
      updated: moment().toJSON()
    },
    { new: true }
  );

  if (!note) return res.status(404).send("Note with given ID was not found");

  console.log(`Note updated! ~~ ${note.title}`);
  res.send(note);
});

router.delete("/:id", async (req, res) => {
  const note = await Note.findByIdAndRemove(req.params.id);

  if (!note) return res.status(404).send("Note with given ID was not found");

  console.log(`Note deleted! ~~ ${note.title}`);
  res.send(note);
});

router.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id).select("-__v");

  if (!note) return res.status(404).send("Note with given ID was not found");

  res.send(note);
});

module.exports = router;
