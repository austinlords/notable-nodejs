const { User, validateUser } = require("../models/usersModel");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { asyncWrap } = require("../middleware/errorHandling");

router.post(
  "/",
  asyncWrap(async (req, res, next) => {
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400);
      throw new Error("User does not exist! Please register");
    }

    await bcrypt.compare(
      req.body.password,
      user.password,
      function comparePasswords(err, isMatch) {
        if (err)
          return res.status(500).json({
            message: "Please try again."
          });

        if (!isMatch)
          return res.status(401).json({
            message: "Invalid password."
          });

        var token = user.generateAuthToken();
        return res.cookie("token", token, { httpOnly: true }).json({
          _id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          userCreated: user.userCreated
        });
      }
    );
  })
);

module.exports = router;
