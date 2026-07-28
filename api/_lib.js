const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
});

const DEFAULTS = {
  winners: require('../data/winners.json'),
  content: require('../data/content.json'),
  submissions: []
};

async function getData(key) {
  try {
    const data = await redis.get(key);
    if (data === null || data === undefined) {
      await redis.set(key, DEFAULTS[key]);
      return DEFAULTS[key];
    }
    return data;
  } catch (e) {
    return DEFAULTS[key] || null;
  }
}

async function setData(key, value) {
  await redis.set(key, value);
}

module.exports = { getData, setData, DEFAULTS };
