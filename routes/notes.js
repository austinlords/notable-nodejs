const moment = require("moment");
const mongoose = require("mongoose");
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

router.post("/", (req, res) => {
  const post = req.body;

  const error = validateNote(post).error;
  if (error) {
    res.status(400);
    return res.send(error.details[0].message);
  }

  res.send(post);
});

module.exports = router;
