const { Queue } = require('bullmq');

const Redis = require('ioredis');

const connection = new Redis({
  host: 'redis',
  port: 6379
});

const scoreQueue = new Queue(
  'scoreQueue',
  {
    connection
  }
);

module.exports = scoreQueue;