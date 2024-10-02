const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Apply rate limiter to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});

app.use(limiter);
app.use(express.json());

const weatherRoute = require("./routes/weather");

app.use("/api/weather", weatherRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
