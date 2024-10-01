const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();
const Todo = require("../models/todo");

router.get("/", auth, async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1;
  const limit = Number.parseInt(req.query.limit) || 10;

  try {
    const todos = await Todo.find({ user: req.userId })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Todo.countDocuments({ user: req.userId });

    res.json({
      data: todos,
      page,
      limit,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    let todo = await Todo.findOne({ title, description });

    if (todo) {
      return res.status(400).json({ message: "Todo already exists" });
    }

    todo = new Todo({
      title,
      description,
      user: req.userId,
    });

    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const todo = await Todo.findById(req.params.id);

    if (todo.user.toString() !== req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    todo.title = title;
    todo.description = description;

    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Todo.findByIdAndDelete(id);

    res.json({ message: "Todo deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
