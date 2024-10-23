const express = require("express");
const router = express.Router();
const { clearCart } = require("../services/cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.use(express.raw({ type: "application/json" }));

router.post("/", async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.metadata.userId;

        await clearCart(userId);
        console.log("Cart cleared");
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
