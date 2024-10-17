const Expenses = require("./model");
const { getDateRanges } = require("./lib");

const getFilteredExpenses = async (filter, userId, startDate, endDate) => {
  const DATE_RANGES = getDateRanges();
  let dateRange;

  // Handle custom date range
  if (filter === "custom") {
    dateRange = DATE_RANGES.custom.validate(startDate, endDate);
  } else if (DATE_RANGES[filter]) {
    dateRange = DATE_RANGES[filter];
  } else {
    throw new Error("Invalid filter type");
  }

  const expenses = await Expenses.find({
    user: userId,
    date: dateRange,
  }).sort({ date: -1 }); // Sort by date, most recent first

  return expenses;
};

const addExpense = async (amount, description, date, userId) => {
  const filter = { date, user: userId }; // Filter by date and user

  const update = {
    amount,
    description,
    date,
    user: userId,
  };

  await Expenses.findOneAndUpdate(
    filter, // Filter to find matching document
    { $set: update }, // Update document if found
    {
      upsert: true, // Insert if not found
    }
  );
};

const getExpenses = async (userId) => {
  return await Expenses.find({ user: userId });
};

const updateExpense = async (expenseId, newExpense, userId) => {
  const result = await Expenses.findOneAndUpdate(
    { _id: expenseId, user: userId }, // find the record by id and user
    { $set: newExpense }, // $set means update the specified fields
    { new: true } // return the updated document
  );

  if (!result) {
    throw new Error("Record not found");
  }

  return result;
};

const deleteExpense = async (expenseId) => {
  const expense = await Expenses.findOne({ _id: expenseId });

  if (!expense) {
    throw new Error("Record not found");
  }

  await expense.deleteOne();
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getFilteredExpenses,
};
