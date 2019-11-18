const express = require("express");
const app = express();
const config = require("config");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const notes = require("./routes/notesRoute");
const users = require("./routes/usersRoute");
const collections = require("./routes/collectionsRoute");

const MONGODB_URI = process.env.MONGO || config.get("db");
const PORT = config.get("port");

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`connected to ${MONGODB_URI}`))
  .catch(err => console.log(`unable to connect to MongoDB---${err}`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/notes", notes);
app.use("/api/users", users);
app.use("/api/collections", collections);

const port = process.env.PORT || PORT;
const server = app.listen(port, () =>
  console.log(`Notable API listening on port ${port}`)
);

module.exports = server;
