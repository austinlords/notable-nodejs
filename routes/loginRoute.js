const { User, validateUser } = require("../models/usersModel");
const bcrypt = require("bcrypt");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log("Login API accessed: ", new Date().toLocaleString();
  next();
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) return res.status(404).send("User with given ID was not found");

  console.log(`Hello ${user.email}, welcome back to Notable.`);

  res.send(user);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User already registered with this email!");

  user = new User({
    email: req.body.email,
    password: req.body.password,
    isAdmin: req.body.isAdmin
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save(function savingUser(error, user) {
    if (error) {
      console.log("an error occured when saving user: " + error);
      return res
        .status(500)
        .send("an error occured when creating your account. please try again");
    } else {
      console.log("New User created! Welcome " + user.email);
    }
  });

  const token = user.generateAuthToken();

  res.header("Authorization", token).send({
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    userCreated: user.userCreated
  });
});

module.exports = router;