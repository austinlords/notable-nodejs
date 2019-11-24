const express = require("express");
const app = express();
const config = require("config");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { catchErrors } = require("./middleware/errorHandling");
const mongoose = require("mongoose");
const notes = require("./routes/notesRoute");
const register = require("./routes/registerRoute");
const login = require("./routes/loginRoute");
const logout = require("./routes/logoutRoute");
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
  .catch(err => console.log(`unable to connect to MongoDB---${err.message}`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/notes", notes);
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/logout", logout);
app.use("/api/collections", collections);
app.use(catchErrors);

const port = process.env.PORT || PORT;
const server = app.listen(port, () =>
  console.log(`Notable API listening on port ${port}`)
);

process
  .on("unhandledRejection", err => {
    console.error(err.message);
  })
  .on("uncaughtException", err => {
    console.error(err.message);
    process.exit(1);
  });

module.exports = server;
