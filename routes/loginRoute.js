const { User, validateUser } = require("../models/usersModel");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("User does not exist! Please register");

  await bcrypt.compare(
    req.body.password,
    user.password,
    function comparePasswords(err, isMatch) {
      if (err) return res.send(err.message);

      if (!isMatch) return res.status(401).send("Invalid password.");

      var token = user.generateAuthToken();
      return res.cookie("token", token).send({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        userCreated: user.userCreated
      });
    }
  );
});

module.exports = router;
