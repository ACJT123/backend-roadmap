const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    req.userId = decoded.userId;

    console.log(req);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = auth;
