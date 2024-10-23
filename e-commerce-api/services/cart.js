const Cart = require("../models/cart");

const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  return cart || []; // return an empty array if no cart exists
};

const updateCart = async (userId, productId, priceId, quantity) => {
  // Attempt to increment quantity if product exists in cart
  const cart = await Cart.findOneAndUpdate(
    { userId, "products.productId": productId, "products.priceId": priceId },
    { $inc: { "products.$.quantity": quantity } }
  );

  // If product doesn't exist in the cart, add it
  if (!cart) {
    await Cart.findOneAndUpdate(
      { userId },
      { $push: { products: { productId, priceId, quantity } } },
      { upsert: true } // Create the cart if it doesn't exist
    );
  }
};

const removeProductFromCart = async (userId, productId) => {
  await Cart.findOneAndUpdate(
    { userId },
    { $pull: { products: { productId } } }
  );
};

const decQuantity = async (userId, productId, priceId, quantity) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  // Find the cart with the specific product
  const cart = await Cart.findOne({
    userId,
    "products.productId": productId,
    "products.priceId": priceId,
  });

  if (!cart) {
    return "Cart not found or product not in cart";
  }

  const product = cart.products.find(
    (p) => p.productId === productId && p.priceId === priceId
  );
  const leftQuantity = product.quantity - quantity;

  if (leftQuantity > 0) {
    // If left quantity is positive, decrement it
    await Cart.findOneAndUpdate(
      { userId, "products.productId": productId, "products.priceId": priceId },
      { $set: { "products.$.quantity": leftQuantity } }
    );
    return "Product quantity decreased";
  }

  // If left quantity is zero or negative, remove the product
  await removeProductFromCart(userId, productId);
  return "Product removed from cart";
};

const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } });
};

module.exports = {
  getCart,
  updateCart,
  removeProductFromCart,
  decQuantity,
  clearCart,
};
