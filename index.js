const express = require("express");
const app = express();
const config = require("config");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const notes = require("./routes/notes");

const MONGODB_URI = config.get("db");
const PORT = config.get("port");

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.use(express.static("public"));
app.use(bodyParser.json(), cors());

app.use("/api/notes", notes);

const port = process.env.PORT || PORT;
const server = app.listen(port, () =>
  console.log(`Notable listening on port ${port}`)
);

module.exports = server;
