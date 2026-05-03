const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis',
  port: 6379,
  maxRetriesPerRequest: null
});

redis.on('connect', () => {
  console.log('Redis connected');
});

module.exports = redis;