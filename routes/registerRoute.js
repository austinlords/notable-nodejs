const { User, validateUser } = require("../models/usersModel");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { asyncWrap } = require("../middleware/errorHandling");

router.post(
  "/",
  asyncWrap(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400);
      throw new Error("User already registered with this email!");
    }

    user = new User({
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();
    const token = user.generateAuthToken();

    return res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 2592000000),
        sameSite: "none",
        secure: true
      })
      .set("x-auth", token)
      .set("access-control-expose-headers", "x-auth")
      .json({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        userCreated: user.userCreated
      });
  })
);

module.exports = router;
