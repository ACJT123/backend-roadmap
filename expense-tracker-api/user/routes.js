const express = require("express");
const router = express.Router();
const { login, signUp } = require("./services");
const validateUserCredentials = require("./middleware");

router.post("/sign-up", validateUserCredentials, async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await signUp(email, password);

    res.status(201).json({ message: "User created", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", validateUserCredentials, async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await login(email, password);

    res.status(201).json({ message: "Logged In", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
