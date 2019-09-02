const express = require("express");
const app = express();
const config = require("config");
const notes = require("./routes/notes");

app.use("/api/notes", notes);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}`)
);

module.exports = server;
