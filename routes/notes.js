const moment = require("moment");
const { Note, validateNote } = require("../models/notes");
const express = require("express");
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log("Notes API: ", new Date().toLocaleString());
  next();
});

router.get("/", (req, res) => {
  res.send("hello world");
});

router.post("/", async (req, res) => {
  const { error } = validateNote(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
    updated: moment().toJSON,
    preview: req.body.preview,
    user: req.body.user
  });
  await newNote.save();
  console.log(newNote);

  res.send(newNote);
});

module.exports = router;
