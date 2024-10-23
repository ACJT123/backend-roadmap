const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Create a checkout session
 * @param {Object} cart - Cart object
 */
const checkoutSession = async (cart) => {

  const session = await stripe.checkout.sessions.create({
    line_items: cart.products.map((product) => ({
      price: product.priceId,
      quantity: product.quantity,
    })),
    mode: "payment",
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
    metadata: {
      userId: cart.userId.toString(),
    },
  });

  return session;
};

module.exports = {
  checkoutSession,
};
