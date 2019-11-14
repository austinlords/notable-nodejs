const { User, validateUser } = require("../models/usersModel");
const bcrypt = require("bcrypt");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log("Users API accessed: ", new Date().toLocaleString());
  next();
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) return res.status(404).send("User with given ID was not found");

  console.log(`Hello ${user.email}, welcome back to Notable.`);

  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User already registered with this email!");

  user = new User({
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin || false
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  console.log("New User created! Welcome " + user.email);

  res.header("Authorization", token).send({
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  });
});

module.exports = router;
