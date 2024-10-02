const axios = require("axios");
const { getCache, setCache } = require("../utils/redis");

const getWeatherFromApi = async (location) => {
  // encode location
  location = encodeURI(location);

  const response = await axios.get(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${process.env.WEATHER_API_KEY}&contentType=json`
  );

  console.log("Data fetched from API");

  return response.data;
};

const getWeatherFromCache = async (location) => {
  const cacheKey = `weather:${location}`;

  // Check if the data is in the cache
  const cacheData = await getCache(cacheKey);

  if (cacheData) {
    console.log("Data fetched from cache");
    return cacheData;
  }

  // If the data is not in the cache, fetch it from the API
  const weatherData = await getWeatherFromApi(location);

  // Store the data in the cache
  await setCache(cacheKey, weatherData);

  console.log("Data stored in cache");

  return weatherData;
};

module.exports = {
  getWeatherFromApi,
  getWeatherFromCache,
};
