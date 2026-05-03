const { Pool } = require('pg');

const Redis = require('ioredis');

require('dotenv').config();


const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


const redis = new Redis({
  host: '127.0.0.1',
  port: 6379
});

async function rebuildRedis() {

  try {

    console.log(
      'Fetching scores from PostgreSQL...'
    );

    const result = await pool.query(
      `
      SELECT user_id, score
      FROM scores
      `
    );

    console.log(
      `Found ${result.rows.length} users`
    );

    for (const row of result.rows) {

      await redis.zadd(
        'leaderboard',
        row.score,
        row.user_id
      );

    }

    console.log(
      'Redis rebuild completed successfully'
    );

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);

  }
}

rebuildRedis();