const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// middleware
app.use(cors());
app.use(express.json());

const port = 3000;

// connect to MongoDB
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// routes
const urlRoutes = require("./routes/url");
app.use("/api/shorten", urlRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
