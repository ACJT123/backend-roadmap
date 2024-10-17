const validateUserCredentials = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = validateUserCredentials;
