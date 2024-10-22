const express = require("express");
const router = express.Router();
const { login, signUp } = require("../services/auth");

const requestValidator = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  next();
};

router.post("/login", requestValidator, async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const token = await login(email, password);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

router.post("/sign-up", requestValidator, async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const token = await signUp(email, password);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
