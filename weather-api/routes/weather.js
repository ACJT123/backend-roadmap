const express = require("express");
const { getWeatherFromCache } = require("../services/weather");

const router = express.Router();

router.get("/:location", async (req, res) => {
  try {
    const location = req.params.location;

    if (!location) {
      return res.status(400).send("Location is required to get weather data");
    }

    const result = await getWeatherFromCache(location);

    res.json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the weather data");
  }
});

module.exports = router;
