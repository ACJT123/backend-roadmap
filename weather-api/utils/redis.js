const { createClient } = require("redis");

const EXP_TIME = 12 * 3600; // 12 hours

// Initialize Redis client
const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Connect to Redis
redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((error) => {
    console.error("Error connecting to Redis: ", error);
  });

// Error event listener for Redis
redisClient.on("error", (error) => {
  console.error("Redis error: ", error);
});

const setCache = async (key, value) => {
  // set the key-value pair with an expiration time of 12 hours
  await redisClient.setEx(key, EXP_TIME, JSON.stringify(value));
};

const getCache = async (key) => {
  const value = await redisClient.get(key);
  return JSON.parse(value);
};

module.exports = {
  setCache,
  getCache,
};
