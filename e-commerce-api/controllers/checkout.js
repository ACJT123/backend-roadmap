const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { checkoutSession } = require("../services/checkout");
const { getCart } = require("../services/cart");

// use middleware to check if user is authenticated
router.use(verifyToken);

router.post("/", async (req, res, next) => {
  const userId = req.userId;

  try {
    const cart = await getCart(userId);

    if (cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const session = await checkoutSession(cart);
    const url = session.url;

    if (!url) {
      return res
        .status(500)
        .json({ message: "Error creating checkout session" });
    }

    res.json({ url });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
