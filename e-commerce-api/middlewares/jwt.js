const jwt = require("jsonwebtoken");
const { signToken } = require("../libs/jwt");

const verifyToken = (req, res, next) => {
  // Ensure the Authorization header exists
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res.status(401).send("Authorization header missing or malformed");
  }

  const token = req.headers.authorization.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        // Re-sign a new token and return it if expired
        const newToken = signToken(decoded.userId); // Assuming `userId` is stored in the payload

        // Attach userId to request and send new token
        req.userId = decoded.userId;
        res.setHeader("Authorization", `Bearer ${newToken}`);
        return res
          .status(401)
          .send({
            message: "Token expired. New token issued.",
            token: newToken,
          });
      } else {
        // Token is invalid for another reason
        return res.status(403).send("Invalid token");
      }
    } else {
      // Token is valid, attach userId to request
      req.userId = decoded.userId;
      next();
    }
  });
};

module.exports = { verifyToken };
