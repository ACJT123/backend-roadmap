const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const {
  getCart,
  updateCart,
  removeProductFromCart,
  decQuantity,
  clearCart,
} = require("../services/cart");
const { getProduct } = require("../services/products");

// use middleware to check if user is authenticated
router.use(verifyToken);

router.get("/", async (req, res, next) => {
  const userId = req.userId;

  try {
    const cart = await getCart(userId);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const userId = req.userId;
  const { productId, quantity } = req.body;
  const { dec } = req.query;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "productId and quantity are required" });
  }
  try {
    const isProductExist = await getProduct(productId);

    if (!isProductExist) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (dec) {
      const message = await decQuantity(userId, productId, quantity);
      return res.status(400).json({ message });
    }

    await updateCart(userId, productId, quantity);
    res.status(201).json({ message: "Product added to cart" });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  const userId = req.userId;
  const { productId } = req.body;
  const { clear } = req.query;

  try {
    if (clear) {
      await clearCart(userId);
      return res.status(200).json({ message: "Cart cleared" });
    }

    await removeProductFromCart(userId, productId);
    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
