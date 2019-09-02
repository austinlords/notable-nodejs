const moment = require("moment");
const mongoose = require("mongoose");
const { Note, validateNote } = require("../models/notes");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const notes = await Note.find()
    .select()
    .sort("updated");
  res.send(notes);
});
