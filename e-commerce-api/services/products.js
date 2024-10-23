const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getProducts = async (limit) => {
  const products = await stripe.products.list({
    limit: limit || 10,
  });

  await Promise.all(
    products.data.map(async (product) => {
      product.price = await _getPriceById(product.default_price);
    })
  );

  return products.data;
};

const getProduct = async (productId) => {
  return await stripe.products.retrieve(productId);
};

const _getPriceById = async (priceId) => {
  const price = await stripe.prices.retrieve(priceId);

  return price.unit_amount;
};

module.exports = {
  getProducts,
  getProduct,
};
