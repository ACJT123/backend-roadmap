const express = require("express");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();
app.use(express.json());

const port = process.env.PORT || 3000;

const auth = require("./routes/auth");
const todo = require("./routes/todo");

app.use("/api/auth", auth);
app.use("/api/todo", todo);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
