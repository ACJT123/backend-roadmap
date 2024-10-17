const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./user/routes");
const expensesRoutes = require("./expenses/routes");
app.use("/api/user", userRoutes);
app.use("/api/expenses", expensesRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
