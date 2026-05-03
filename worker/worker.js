const { Worker } = require('bullmq');

const Redis = require('ioredis');

const { Pool } = require('pg');

require('dotenv').config();

const connection = new Redis({
  host: 'redis',
  port: 6379,
  maxRetriesPerRequest: null
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const worker = new Worker(
  'scoreQueue',

  async job => {

    const { userId, score } = job.data;

    console.log(
      `Saving ${userId} to PostgreSQL`
    );

    await pool.query(
      `
      INSERT INTO scores(user_id, score)
      VALUES($1, $2)
      ON CONFLICT(user_id)
      DO UPDATE SET score = EXCLUDED.score
      `,
      [userId, score]
    );

    console.log('Saved successfully');

  },

  {
    connection
  }
);