const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;
    console.log("protected route accessed! User: " + req.user._id);
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token provided");
  }
};
