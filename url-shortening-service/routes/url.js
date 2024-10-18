const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  deleteShortUrl,
  getOriginalUrl,
  getUrlStats,
  updateShortUrl,
} = require("../services/url");

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const savedUrl = await createShortUrl(url);

    res.status(201).json({ message: "URL shortened successfully", savedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:code", async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ message: "Short code is required" });
  }

  try {
    const url = await getOriginalUrl(code);

    res.status(301).redirect(url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get original url" });
  }
});

router.delete("/:code", async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ message: "Short code is required" });
  }

  try {
    await deleteShortUrl(code);

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get url stats" });
  }
});

router.put("/:code", async (req, res) => {
  const { code } = req.params;
  const { url } = req.body;

  if (!code || !url) {
    return res.status(400).json({ message: "Short code and Url is required" });
  }

  try {
    const updatedUrl = await updateShortUrl(code, url);

    res.status(200).json({ updatedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update url" });
  }
});

router.get("/:code/stats", async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ message: "Short code is required" });
  }

  try {
    const url = await getUrlStats(code);

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get url stats" });
  }
});

module.exports = router;
