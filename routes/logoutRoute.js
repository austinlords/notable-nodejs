const express = require("express");
const router = express.Router();

router.post("/", (req, res, next) => {
  res.clearCookie("token");
  return res.json("User logout successful");
});

module.exports = router;
