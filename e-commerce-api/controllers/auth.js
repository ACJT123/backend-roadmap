const express = require("express");
const router = express.Router();
const { login, signUp } = require("../services/auth");
const { requestValidator } = require("../middlewares/auth");

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
