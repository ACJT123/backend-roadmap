const mongoose = require("mongoose");
const { Schema } = mongoose;

const expensesSchema = new Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Expense", expensesSchema);
