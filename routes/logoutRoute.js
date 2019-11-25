const express = require("express");
const router = express.Router();

router.post("/", (req, res, next) => {
  res.clearCookie("token");
  return res.json({ message: "User logout successful" });
});

module.exports = router;
