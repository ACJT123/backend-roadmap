const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());

const errorLogger = require("./middlewares/errorLogger");
app.use(errorLogger);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

const authController = require("./controllers/auth");
const productsController = require("./controllers/products");
const cartController = require("./controllers/cart");
const checkoutController = require("./controllers/checkout");

const stripeWebhookController = require("./controllers/stripe-webhook");
app.use("/api/stripe-webhook", stripeWebhookController);

app.use(express.json());
app.use("/api/auth", authController);
app.use("/api/products", productsController);
app.use("/api/cart", cartController);
app.use("/api/checkout", checkoutController);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
