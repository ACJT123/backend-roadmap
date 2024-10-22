const express = require("express");
const router = express.Router();
const { getProducts } = require("../services/products");

router.get("/", async (req, res, next) => {
  const { limit } = req.query;

  try {
    const products = await getProducts(limit);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
