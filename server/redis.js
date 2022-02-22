const redis = require("redis");

module.exports.client = redis.createClient({
  url: process.env.REDIS_URL ? process.env.REDIS_URL : "redis://localhost:6379",
});
