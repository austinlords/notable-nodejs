const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/usersModel");
const { asyncWrap } = require("../middleware/errorHandling");

module.exports = asyncWrap(async function(req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.cookies.token;
  const reqXAuth = req.get("x-auth");
  if (!token && !reqXAuth) {
    res.status(401);
    throw new Error("Access denied. No token provided");
  }

  try {
    var decoded = jwt.verify(token || reqXAuth, process.env.JWT);
  } catch (error) {
    if (req.baseUrl.includes("user")) {
      res.status(200);
      return res.json({ error: "User not logged in" });
    } else {
      res.status(400);
      throw new Error("Invalid auth token");
    }
  }

  const user = await User.findById(decoded._id, "-__v -password");

  if (!user) {
    res.status(400);
    throw new Error("User not found in database.");
  } else {
    req.user = user;
    // auth-token matches user/email in request body?
    if (req.body.user && req.user.email !== req.body.user) {
      res.status(400);
      throw new Error(
        "Auth token does not match user/email in request. Please try again."
      );
    }
    res.set("x-auth", token || reqXAuth);
    res.set("access-control-expose-headers", "x-auth");
    next();
  }
});
