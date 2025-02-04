const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.ip, // Use the correct IP from Express
  message: "Too many requests from this IP, please try again later.",
});

module.exports = limiter;
