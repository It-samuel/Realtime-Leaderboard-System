const pool = require('./db');

async function seed() {

  for (let i = 1; i <= 1000; i++) {

    await pool.query(
      `
      INSERT INTO scores(user_id, score)
      VALUES($1, $2)
      `,
      [
        `user_${i}`,
        Math.floor(Math.random() * 100000)
      ]
    );

    console.log(i);
  }

  console.log('Done');
}

seed();