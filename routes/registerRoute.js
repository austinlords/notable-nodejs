const { User, validateUser } = require("../models/usersModel");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { asyncWrap } = require("../middleware/errorHandling");

router.post(
  "/",
  asyncWrap(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    throw new Error("test error");

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

    await user.save(function saveUser(error, user) {
      if (error) return res.status(500).send("Error. Please try again");

      const token = user.generateAuthToken();
      return res.cookie("token", token, { httpOnly: true }).send({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        userCreated: user.userCreated
      });
    });
  })
);

module.exports = router;
