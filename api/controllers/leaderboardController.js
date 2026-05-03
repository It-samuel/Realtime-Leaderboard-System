const pool = require('../db');
const redis = require('../redis');
const scoreQueue = require('../queue');


exports.submitScore = async (req, res) => {
  try {

    const { userId, score } = req.body;

    // Save instantly to Redis
    await redis.zadd(
      'leaderboard',
      score,
      userId
    );

    // Push PostgreSQL save to queue
    await scoreQueue.add(
      'save-score',
      {
        userId,
        score
      }
    );

    res.json({
      success: true,
      message: 'Score submitted instantly'
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Internal server error'
    });

  }
};

exports.getLeaderboard = async (req, res) => {
  try {

    const leaderboard =
      await redis.zrevrange(
        'leaderboard',
        0,
        99,
        'WITHSCORES'
      );

    const formatted = [];

    for (let i = 0; i < leaderboard.length; i += 2) {
      formatted.push({
        userId: leaderboard[i],
        score: leaderboard[i + 1]
      });
    }

    res.json(formatted);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Internal server error'
    });

  }
};


exports.getRank = async (req, res) => {
  try {

    const start = Date.now();

    const userId = req.params.userId;

    const rank = await redis.zrevrank(
      'leaderboard',
      userId
    );

    const end = Date.now();

    console.log(
      `Redis rank query took ${end - start}ms`
    );

    res.json({
      userId,
      rank: rank + 1,
      duration: `${end - start}ms`
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Internal server error'
    });

  }
};