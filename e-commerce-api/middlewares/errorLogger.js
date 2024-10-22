// error logging
const errorLogger = (err, req, res, next) => {
  console.error("ErrorLogger: ", err);

  res.status(500).send("Internal server error");

  next();
};

module.exports = errorLogger;
