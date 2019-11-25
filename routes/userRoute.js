const { User } = require("../models/usersModel");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { asyncWrap } = require("../middleware/errorHandling");

router.get(
  "/",
  auth,
  asyncWrap(async (req, res, next) => {
    let user = await User.findOne({ email: req.user.email }).select(
      "-password -__v"
    );
    if (!user) {
      res.status(400);
      throw new Error("User does not exist! Please register");
    }

    return res.json(user);
  })
);

module.exports = router;
