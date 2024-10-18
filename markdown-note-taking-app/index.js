const express = require("express");
const multer = require("multer");
const cors = require("cors");
const notes = require("./model/notes");
const handleUpload = require("./services/upload");
const checkGrammar = require("./services/check-grammar");
const renderHtml = require("./services/render-html");
const handleDelete = require("./services/delete");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(cors());

app.post("/upload", upload.single("markdown"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("Please upload a file");
  }

  try {
    await handleUpload(file);
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving the file");
  }
});

app.get("/check-grammar/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("Please provide a note id");
  }

  try {
    await checkGrammar(id);
    res.status(200).json({ message: "Grammar checked and corrected" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error checking grammar");
  }
});

app.get("/notes", (req, res) => {
  try {
    res.status(200).send(notes.list());
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting the notes");
  }
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("Please provide a note id");
  }

  try {
    handleDelete(id);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the note");
  }
});

app.get("/notes/render-html/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("Please provide a note id");
  }

  try {
    const html = renderHtml(id);
    res.status(200).send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error rendering the note");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
