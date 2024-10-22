const jwt = require("jsonwebtoken");

const signToken = (userId) => {
  return jwt.sign(userId, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { signToken };
