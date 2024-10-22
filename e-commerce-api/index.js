const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());

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

app.use("/api/auth", authController);
app.use("/api/products", productsController);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
