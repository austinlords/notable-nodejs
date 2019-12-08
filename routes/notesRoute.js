const moment = require("moment");
const { Note, validateNote } = require("../models/notesModel");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { asyncWrap } = require("../middleware/errorHandling");

router.get(
  "/",
  auth,
  asyncWrap(async (req, res) => {
    const notes = await Note.find({ user: req.user.email })
      .select("-__v")
      .sort("-updated");

    return res.json(notes);
  })
);

router.post(
  "/",
  auth,
  asyncWrap(async (req, res) => {
    const { error } = validateNote(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const newNote = await new Note({
      title: req.body.title || "",
      content: req.body.content,
      tags: req.body.tags || [],
      col: req.body.collection || Object.create({}),
      user: req.user.email.trim(),
      updated: moment().format()
    }).save();

    return res.json(newNote);
  })
);

router.put(
  "/:id",
  auth,
  asyncWrap(async (req, res) => {
    const { error } = validateNote(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    let note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error("Note with provided ID does not exist.");
    }

    if (note.user !== req.user.email) {
      res.status(403);
      throw new Error("You do not have permission to edit this note.");
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        col: req.body.collection,
        user: req.user.email,
        updated: moment().format()
      },
      { new: true }
    );

    return res.json(updatedNote);
  })
);

router.delete(
  "/:id",
  auth,
  asyncWrap(async (req, res) => {
    let note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error("Note with provided ID does not exist.");
    }

    if (req.user.email !== note.user) {
      res.status(403);
      throw new Error("You do not have permission to delete this note.");
    }

    note = await Note.findByIdAndRemove(req.params.id);

    return res.json(note);
  })
);

router.get(
  "/:id",
  auth,
  asyncWrap(async (req, res) => {
    let note = await Note.findById(req.params.id).select("-__v");

    if (!note) {
      res.status(404);
      throw new Error("Note with provided ID does not exist.");
    }

    if (req.user.email !== note.user) {
      res.status(403);
      throw new Error("You do not have permission to view this note.");
    }

    return res.json(note);
  })
);

module.exports = router;
