const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getFilteredExpenses,
} = require("./services");
const auth = require("../auth/middleware");

router.get("/", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const { filter, startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User Id not found" });
    }

    let expenses;

    if (filter) {
      expenses = await getFilteredExpenses(filter, userId, startDate, endDate);
    } else {
      expenses = await getExpenses(userId);
    }

    res.status(201).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { amount, description, date, userId } = req.body;

    if (!(amount || description || date || userId)) {
      return res.status(400).json({ message: "Incomplete details" });
    }

    await addExpense(amount, description, date, userId);

    res.status(201).json({ message: "Added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Expense id is invalid" });
    }

    const { amount, description, date, userId } = req.body;

    await updateExpense(id, { amount, description, date }, userId);

    res.status(201).json({ message: "updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Expense id is invalid" });
    }

    await deleteExpense(id);

    res.status(201).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
